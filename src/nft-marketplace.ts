// import { BigInt, Address } from "@graphprotocol/graph-ts"; // !!!W delete this if the listingId turns out to be fine as the ID
import {
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
  ItemUpdated as ItemUpdatedEvent,
} from "../generated/NftMarketplace/NftMarketplace";
import {
  ItemBought,
  ItemCanceled,
  ItemListed,
  ItemUpdated,
  Item,
} from "../generated/schema";

export function handleItemListed(event: ItemListedEvent): void {
  let itemListed = ItemListed.load(
    event.params.listingId.toString() // !!!W check if a string like this is ok, or if there are any limitations like if we are at one billion
  );
  let item = Item.load(event.params.listingId.toString());
  if (!itemListed) {
    itemListed = new ItemListed(event.params.listingId.toString());
  }
  if (!item) {
    item = new Item(event.params.listingId.toString());
  }

  itemListed.seller = event.params.seller;
  itemListed.nftAddress = event.params.nftAddress;
  itemListed.tokenId = event.params.tokenId;
  itemListed.price = event.params.price;
  itemListed.listingId = event.params.listingId;
  itemListed.desiredNftAddress = event.params.desiredNftAddress;
  itemListed.desiredTokenId = event.params.desiredTokenId;
  itemListed.isListed = event.params.isListed;

  item.seller = event.params.seller;
  item.nftAddress = event.params.nftAddress;
  item.tokenId = event.params.tokenId;
  item.price = event.params.price;
  item.listingId = event.params.listingId;
  item.desiredNftAddress = event.params.desiredNftAddress;
  item.desiredTokenId = event.params.desiredTokenId;
  item.isListed = event.params.isListed;

  itemListed.save();
  item.save();
}

export function handleItemUpdated(event: ItemUpdatedEvent): void {
  // !!! I added the updated event, since i nmy opinion this is important (patrick doesnt has this for some reason...)
  let itemUpdated = ItemUpdated.load(event.params.listingId.toString());
  let item = Item.load(event.params.listingId.toString());
  if (!itemUpdated) {
    itemUpdated = new ItemUpdated(event.params.listingId.toString());
  }

  itemUpdated.seller = event.params.seller;
  itemUpdated.nftAddress = event.params.nftAddress;
  itemUpdated.tokenId = event.params.tokenId;
  itemUpdated.price = event.params.price;
  itemUpdated.listingId = event.params.listingId;
  itemUpdated.desiredNftAddress = event.params.desiredNftAddress;
  itemUpdated.desiredTokenId = event.params.desiredTokenId;
  itemUpdated.isListed = event.params.isListed;

  item!.price = event.params.price;
  item!.desiredNftAddress = event.params.desiredNftAddress;
  item!.desiredTokenId = event.params.desiredTokenId;
  // !!!W I deleted the seller, nftaddress, tokenId, lisitingId, isListed change because only these 3 here can be updated, so to save processing capacity they dont need to be updadted. However this is just my therory, definetely verify this.

  itemUpdated.save();
  item!.save();
}

export function handleItemBought(event: ItemBoughtEvent): void {
  let itemBought = ItemBought.load(event.params.listingId.toString());
  let item = Item.load(event.params.listingId.toString());
  if (!itemBought) {
    itemBought = new ItemBought(event.params.listingId.toString());
  }
  itemBought.buyer = event.params.buyer;
  itemBought.nftAddress = event.params.nftAddress;
  itemBought.tokenId = event.params.tokenId;
  itemBought.listingId = event.params.listingId;
  itemBought.price = event.params.price; // !!!W i uncommented this !!! because shouldnt i also have the price in graph QL?
  itemBought.desiredNftAddress = event.params.desiredNftAddress;
  itemBought.desiredTokenId = event.params.desiredTokenId;
  itemBought.isListed = event.params.isListed;

  item!.buyer = event.params.buyer;
  item!.isListed = event.params.isListed;

  itemBought.save();
  item!.save();
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  let itemCanceled = ItemCanceled.load(event.params.listingId.toString());
  let item = Item.load(event.params.listingId.toString());
  if (!itemCanceled) {
    itemCanceled = new ItemCanceled(event.params.listingId.toString());
  }
  itemCanceled.seller = event.params.seller;
  itemCanceled.nftAddress = event.params.nftAddress;
  itemCanceled.tokenId = event.params.tokenId;
  itemCanceled.listingId = event.params.listingId;
  itemCanceled.price = event.params.price;
  itemCanceled.desiredNftAddress = event.params.desiredNftAddress;
  itemCanceled.desiredTokenId = event.params.desiredTokenId;
  itemCanceled.isListed = event.params.isListed;

  item!.isListed = event.params.isListed;
  // ***W done - I would prefer to use another event parameter which just says active, sold, or canceled or sth like that. I think using the dead address as a symbol is not professional.

  itemCanceled.save();
  item!.save();
}

// delete this if the listingId turns out to be fine as the entity ID, otherwise, this was the old way to generate a unique ID for each NFT
// function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
//   return tokenId.toHexString() + nftAddress.toHexString(); // this will result in 0x00x2c9d7f070d03d83588e22c23fe858aa71274ad2a for the first nft !!! but kinda doesnt work bc the token Id doesnt get properly converted to a hex: it counts like 00, 10, 20
// }
