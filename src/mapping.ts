import { AavegotchiLendingFacet, AavegotchiRentalAdd, AavegotchiRentalCanceled, ERC721ExecutedRental } from "../generated/AavegotchiLendingFacet/AavegotchiLendingFacet";
import { AAVEGOTCHI_DIAMOND, ALPHA_TOKEN, BIGINT_ZERO, FOMO_TOKEN, FUD_TOKEN, GHST_TOKEN, KEK_TOKEN } from "./constants";
import { getOrCreateLending } from "./helper";

export function handleAddAavegotchiRentalAdd(event: AavegotchiRentalAdd): void {
  let listing = getOrCreateLending(event.params.rentalId.toString());
  listing.cancelled = false;
  listing.completed = false;
  listing.owner = event.params.originalOwner;
  listing.initialCost = event.params.initialCost;
  listing.period = event.params.period;
  listing.time = event.params.time;
  listing.gotchi = event.params.erc721TokenId;

  let contract = AavegotchiLendingFacet.bind(AAVEGOTCHI_DIAMOND)
  let result = contract.try_getAavegotchiRental(event.params.rentalId);
  if(!result.reverted) {
    let data = result.value;
    let split = result.value.revenueSplit;
    if(split.length == 3) {
      listing.splitOwner = split[0]
      listing.splitBorrower = split[1]
      listing.splitOther = split[2]
    }
  
    listing.fomoActive = false;
    listing.alphaActive = false;
    listing.fudActive = false;
    listing.kekActive = false;
    listing.ghstActive = false;

    let tokenList = data.includeList;
    for(let i=0; i<tokenList.length; i++) {
      if(tokenList[i].equals(FOMO_TOKEN)) {
        listing.fomoActive = true;
      } else if(tokenList[i].equals(FUD_TOKEN)) {
        listing.fudActive = true;
      } else if(tokenList[i].equals(ALPHA_TOKEN)) {
        listing.alphaActive = true;
      } else if(tokenList[i].equals(KEK_TOKEN)) {
        listing.kekActive = true;
      } else if(tokenList[i].equals(GHST_TOKEN)) {
        listing.ghstActive = true;
      }
    }

  }
  
  listing.save();
}

export function handleERC721ExecutedRental(event: ERC721ExecutedRental): void {
  let listing = getOrCreateLending(event.params.rentalId.toString());
  listing.borrower = event.params.renter;
  listing.time = event.params.time;
  listing.cancelled = false;
  listing.completed = false;
  listing.owner = event.params.originalOwner;
  listing.initialCost = event.params.initialCost;
  listing.period = event.params.period;
  listing.time = event.params.time;
  listing.gotchi = event.params.erc721TokenId;
  listing.save();

}

export function handleAavegotchiRentalCanceled(event: AavegotchiRentalCanceled): void {
  let listing  = getOrCreateLending(event.params.rentalId.toString());
  listing.cancelled = true;
  listing.completed = true;
  listing.time = event.params.time;
  listing.save();
}