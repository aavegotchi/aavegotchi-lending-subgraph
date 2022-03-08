import { LendingListing } from "../generated/schema";

export function getOrCreateLending(id: string): LendingListing | null {
    let listing = LendingListing.load(id);
    if(!listing) {
        listing = new LendingListing(id);
    }

    return listing;
}