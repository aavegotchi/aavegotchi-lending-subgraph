import { BigInt } from "@graphprotocol/graph-ts";
import { GotchiLendingAdd, GotchiLendingCancel, GotchiLendingClaim, GotchiLendingEnd, GotchiLendingExecute } from "../generated/AavegotchiLendingFacet/AavegotchiLendingFacet";
import { getOrCreateClaimedToken, getOrCreateGotchiLending, updateGotchiLending } from "./helper";

export function handleGotchiLendingAdd(event: GotchiLendingAdd): void {
  let lending = getOrCreateGotchiLending(event.params.listingId);
  lending = updateGotchiLending(lending, event);
  lending.save();
}

export function handleGotchiLendingClaim(event: GotchiLendingClaim): void {
  let lending = getOrCreateGotchiLending(event.params.listingId);
  lending = updateGotchiLending(lending, event);
  for(let i=0;i<event.params.tokenAddresses.length; i++) {
      let ctoken = getOrCreateClaimedToken(event.params.tokenAddresses[i], lending);
      ctoken.amount = ctoken.amount.plus(event.params.amounts[i]);
      ctoken.save();
  }
  lending.save();
}

export function handleGotchiLendingEnd(event: GotchiLendingEnd): void {

  let listingId = event.params.listingId

  // @todo
  // Fix: For Bug in Lending Refactoring 
  if(event.block.number.ge(BigInt.fromI32(28297165)) && event.block.number.lt(BigInt.fromI32(28429796))) {
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