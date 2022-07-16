import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
    GotchiLendingAdd,
    GotchiLendingAdded,
    GotchiLendingCancel,
    GotchiLendingCanceled,
    GotchiLendingClaim,
    GotchiLendingClaimed,
    GotchiLendingEnd,
    GotchiLendingEnded,
    GotchiLendingExecute,
    GotchiLendingExecuted,
} from "../generated/AavegotchiLendingFacet/AavegotchiLendingFacet";
import { BIGINT_ZERO } from "./constants";
import {
    getOrCreateClaimedToken,
    getOrCreateGotchiLending,
    getOrCreateWhitelist,
    updateGotchiLending,
} from "./helper";

export function handleGotchiLendingAdd(event: GotchiLendingAdd): void {
    let lending = getOrCreateGotchiLending(event.params.listingId);
    lending = updateGotchiLending(lending, event);
    lending.save();
}

export function handleGotchiLendingClaim(event: GotchiLendingClaim): void {
    let lending = getOrCreateGotchiLending(event.params.listingId);
    lending = updateGotchiLending(lending, event);
    for (let i = 0; i < event.params.tokenAddresses.length; i++) {
        let ctoken = getOrCreateClaimedToken(
            event.params.tokenAddresses[i],
            lending
        );
        ctoken.amount = ctoken.amount.plus(event.params.amounts[i]);
        ctoken.save();
    }
    lending.save();
}

export function handleGotchiLendingEnd(event: GotchiLendingEnd): void {
    let listingId = event.params.listingId;

    // @todo
    // Fix: For Bug in Lending Refactoring
    if (
        event.block.number.ge(BigInt.fromI32(28297165)) &&
        event.block.number.lt(BigInt.fromI32(28429796))
    ) {
        // let gotchi = getOrCreateAavegotchi(event.params.listingId.toString(), event)!
        // listingId = gotchi.lending!;
    }

    let lending = getOrCreateGotchiLending(listingId);
    lending = updateGotchiLending(lending, event);
    lending.save();
}

export function handleGotchiLendingExecute(event: GotchiLendingExecute): void {
    let lending = getOrCreateGotchiLending(event.params.listingId);
    lending = updateGotchiLending(lending, event);
    lending.save();
}

export function handleGotchiLendingCancel(event: GotchiLendingCancel): void {
    let lending = getOrCreateGotchiLending(event.params.listingId);
    lending = updateGotchiLending(lending, event);
    lending.save();
}

export function handleGotchiLendingAdded(event: GotchiLendingAdded): void {
    let lending = getOrCreateGotchiLending(event.params.listingId);
    lending.upfrontCost = event.params.initialCost;
    lending.lender = event.params.lender;
    lending.originalOwner = event.params.originalOwner;
    lending.period = event.params.period;
    lending.splitOwner = BigInt.fromI32(event.params.revenueSplit[0]);
    lending.splitBorrower = BigInt.fromI32(event.params.revenueSplit[1]);
    lending.splitOther = BigInt.fromI32(event.params.revenueSplit[2]);
    lending.tokensToShare = event.params.revenueTokens.map<Bytes>((e) => e);
    lending.thirdPartyAddress = event.params.thirdParty;
    lending.timeCreated = event.params.timeCreated;
    lending.gotchiTokenId = event.params.tokenId;
    lending.cancelled = false;
    lending.completed = false;
    if (event.params.whitelistId != BIGINT_ZERO) {
        let whitelist = getOrCreateWhitelist(event.params.whitelistId, event);
        if (whitelist) {
            lending.whitelist = whitelist.id;
            lending.whitelistMembers = whitelist.members;
            lending.whitelistId = BigInt.fromString(whitelist.id);
        }
    }
    lending.save();
}

export function handleGotchiLendingClaimed(event: GotchiLendingClaimed): void {
    let lending = getOrCreateGotchiLending(event.params.listingId);
    for (let i = 0; i < event.params.revenueTokens.length; i++) {
        let ctoken = getOrCreateClaimedToken(
            event.params.revenueTokens[i],
            lending
        );
        ctoken.amount = ctoken.amount.plus(event.params.amounts[i]);
        ctoken.save();
    }
    lending.upfrontCost = event.params.initialCost;
    lending.lender = event.params.lender;
    lending.originalOwner = event.params.originalOwner;
    lending.period = event.params.period;
    lending.splitOwner = BigInt.fromI32(event.params.revenueSplit[0]);
    lending.splitBorrower = BigInt.fromI32(event.params.revenueSplit[1]);
    lending.splitOther = BigInt.fromI32(event.params.revenueSplit[2]);
    lending.tokensToShare = event.params.revenueTokens.map<Bytes>((e) => e);
    lending.thirdPartyAddress = event.params.thirdParty;
    lending.lastClaimed = event.params.timeClaimed;
    lending.gotchiTokenId = event.params.tokenId;
    lending.borrower = event.params.borrower;
    lending.cancelled = false;
    lending.completed = false;
    if (event.params.whitelistId != BIGINT_ZERO) {
        let whitelist = getOrCreateWhitelist(event.params.whitelistId, event);
        if (whitelist) {
            lending.whitelist = whitelist.id;
            lending.whitelistMembers = whitelist.members;
            lending.whitelistId = BigInt.fromString(whitelist.id);
        }
    }
    lending.save();
}

export function handleGotchiLendingCanceled(
    event: GotchiLendingCanceled
): void {
    let lending = getOrCreateGotchiLending(event.params.listingId);
    lending.upfrontCost = event.params.initialCost;
    lending.lender = event.params.lender;
    lending.originalOwner = event.params.originalOwner;
    lending.period = event.params.period;
    lending.splitOwner = BigInt.fromI32(event.params.revenueSplit[0]);
    lending.splitBorrower = BigInt.fromI32(event.params.revenueSplit[1]);
    lending.splitOther = BigInt.fromI32(event.params.revenueSplit[2]);
    lending.tokensToShare = event.params.revenueTokens.map<Bytes>((e) => e);
    lending.thirdPartyAddress = event.params.thirdParty;
    lending.gotchiTokenId = event.params.tokenId;
    lending.cancelled = true;
    lending.completed = false;
    if (event.params.whitelistId != BIGINT_ZERO) {
        let whitelist = getOrCreateWhitelist(event.params.whitelistId, event);
        if (whitelist) {
            lending.whitelist = whitelist.id;
            lending.whitelistMembers = whitelist.members;
            lending.whitelistId = BigInt.fromString(whitelist.id);
        }
    }
    lending.save();
}

export function handleGotchiLendingExecuted(
    event: GotchiLendingExecuted
): void {
    let lending = getOrCreateGotchiLending(event.params.listingId);
    lending.upfrontCost = event.params.initialCost;
    lending.lender = event.params.lender;
    lending.originalOwner = event.params.originalOwner;
    lending.period = event.params.period;
    lending.splitOwner = BigInt.fromI32(event.params.revenueSplit[0]);
    lending.splitBorrower = BigInt.fromI32(event.params.revenueSplit[1]);
    lending.splitOther = BigInt.fromI32(event.params.revenueSplit[2]);
    lending.tokensToShare = event.params.revenueTokens.map<Bytes>((e) => e);
    lending.thirdPartyAddress = event.params.thirdParty;
    lending.gotchiTokenId = event.params.tokenId;
    lending.cancelled = false;
    lending.completed = false;
    lending.borrower = event.params.borrower;
    if (event.params.whitelistId != BIGINT_ZERO) {
        let whitelist = getOrCreateWhitelist(event.params.whitelistId, event);
        if (whitelist) {
            lending.whitelist = whitelist.id;
            lending.whitelistMembers = whitelist.members;
            lending.whitelistId = BigInt.fromString(whitelist.id);
        }
    }
    lending.save();
}

export function handleGotchiLendingEnded(event: GotchiLendingEnded): void {
    let lending = getOrCreateGotchiLending(event.params.listingId);
    lending.upfrontCost = event.params.initialCost;
    lending.lender = event.params.lender;
    lending.originalOwner = event.params.originalOwner;
    lending.period = event.params.period;
    lending.splitOwner = BigInt.fromI32(event.params.revenueSplit[0]);
    lending.splitBorrower = BigInt.fromI32(event.params.revenueSplit[1]);
    lending.splitOther = BigInt.fromI32(event.params.revenueSplit[2]);
    lending.tokensToShare = event.params.revenueTokens.map<Bytes>((e) => e);
    lending.thirdPartyAddress = event.params.thirdParty;
    lending.gotchiTokenId = event.params.tokenId;
    lending.completed = true;
    if (event.params.whitelistId != BIGINT_ZERO) {
        let whitelist = getOrCreateWhitelist(event.params.whitelistId, event);
        if (whitelist) {
            lending.whitelist = whitelist.id;
            lending.whitelistMembers = whitelist.members;
            lending.whitelistId = BigInt.fromString(whitelist.id);
        }
    }
    lending.save();
}
