import { BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { AavegotchiLendingFacet } from "../generated/AavegotchiLendingFacet/AavegotchiLendingFacet";
import { ClaimedToken, GotchiLending, Whitelist } from "../generated/schema";
import { BIGINT_ZERO } from "./constants";

export function createOrUpdateWhitelist(id: BigInt, event: ethereum.Event): Whitelist | null {
    let contract = AavegotchiLendingFacet.bind(event.address);
    let response = contract.try_getWhitelist(id);
  
    if(response.reverted) {
      return null;
    }
  
    let result = response.value;
  
    let members = result.addresses;
    let name = result.name;
  
    let whitelist = Whitelist.load(id.toString());
    if(!whitelist) {
      whitelist = new Whitelist(id.toString());
      whitelist.ownerAddress = result.owner;
      whitelist.name = name;
    }
  
    whitelist.members = members.map<Bytes>(e => e);
  
    whitelist.save();
    return whitelist;
  }
  
  export function getOrCreateGotchiLending(listingId: BigInt): GotchiLending {
      let lending = GotchiLending.load(listingId.toString());
      if(!lending) {
        lending = new GotchiLending(listingId.toString());
        lending.cancelled = false;
        lending.completed = false;
        lending.whitelist = null;
        lending.whitelistMembers = [];
        lending.whitelistId = null;
      }
  
      return lending;
  }
  
  export function updateGotchiLending(lending: GotchiLending, event: ethereum.Event): GotchiLending {
    let contract = AavegotchiLendingFacet.bind(event.address);
    let response = contract.try_getGotchiLendingListingInfo(BigInt.fromString(lending.id));
    if(response.reverted) {
      return lending;
    }
  
    let listingResult = response.value.value0;
    let gotchiResult = response.value.value1;

  
    lending.borrower = listingResult.borrower;
    lending.cancelled = listingResult.canceled;
    lending.completed = listingResult.completed;
    lending.gotchiTokenId = listingResult.erc721TokenId;
    
    lending.gotchiBRS = gotchiResult.modifiedRarityScore;
    lending.gotchiKinship = gotchiResult.kinship;
  
    lending.tokensToShare = listingResult.revenueTokens.map<Bytes>(e => e);
    lending.upfrontCost = listingResult.initialCost;
  
    lending.lastClaimed = listingResult.lastClaimed;
  
    lending.lender = listingResult.lender;
    lending.originalOwner = listingResult.originalOwner;
  
    
    if(listingResult.whitelistId != BIGINT_ZERO) {
      let whitelist = createOrUpdateWhitelist(listingResult.whitelistId, event);
      if(whitelist !== null) {
        lending.whitelist = whitelist.id;
        lending.whitelistMembers = whitelist.members;
        lending.whitelistId = BigInt.fromString(whitelist.id);
      }
    }
  
    lending.period = listingResult.period;
  
    lending.splitOwner = BigInt.fromI32(listingResult.revenueSplit[0]);
    lending.splitBorrower = BigInt.fromI32(listingResult.revenueSplit[1]);
    lending.splitOther = BigInt.fromI32(listingResult.revenueSplit[2]);
  
    lending.thirdPartyAddress = listingResult.thirdParty;
    lending.timeAgreed = listingResult.timeAgreed;
    lending.timeCreated = listingResult.timeCreated;
  
    return lending;
  }
  
export function getOrCreateClaimedToken(tokenAddress: Bytes, lending: GotchiLending): ClaimedToken {
    let id = lending.id  + "_" + tokenAddress.toHexString();
    let ctoken = ClaimedToken.load(id);
    if(ctoken == null) {
        ctoken = new ClaimedToken(id);
        ctoken.amount = BIGINT_ZERO;
        ctoken.lending = lending.id;
        ctoken.token = tokenAddress;
    }

    return ctoken;
}