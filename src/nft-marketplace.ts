import { BigInt, Address } from "@graphprotocol/graph-ts";
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
  ActiveItem,
} from "../generated/schema";

export function handleItemBought(event: ItemBoughtEvent): void {
  let itemBought = ItemBought.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  if (!itemBought) {
    itemBought = new ItemBought(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }
  itemBought.buyer = event.params.buyer;
  itemBought.nftAddress = event.params.nftAddress;
  itemBought.tokenId = event.params.tokenId;
  itemBought.listingId = event.params.listingId;
  itemBought.price = event.params.price; // i uncommented this !!! shouldnt i also have the price in graph QL?
  itemBought.desiredNftAddress = event.params.desiredNftAddress;
  itemBought.desiredTokenId = event.params.desiredTokenId;

  activeItem!.buyer = event.params.buyer;

  itemBought.save();
  activeItem!.save();
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  let itemCanceled = ItemCanceled.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  if (!itemCanceled) {
    itemCanceled = new ItemCanceled(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }
  itemCanceled.seller = event.params.seller;
  itemCanceled.nftAddress = event.params.nftAddress;
  itemCanceled.tokenId = event.params.tokenId;
  itemCanceled.listingId = event.params.listingId;
  // itemCanceled.price = event.params.price; - doesnt exist on this event
  itemCanceled.desiredNftAddress = event.params.desiredNftAddress;
  itemCanceled.desiredTokenId = event.params.desiredTokenId;

  activeItem!.buyer = Address.fromString(
    "0x000000000000000000000000000000000000dEaD"
  );
  // !!!W I would prefer to use another event parameter which just says active, sold, or canceled or sth like that. I think using the dead address as a symbol is not professional.

  itemCanceled.save();
  activeItem!.save();
}

export function handleItemListed(event: ItemListedEvent): void {
  let itemListed = ItemListed.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  if (!itemListed) {
    itemListed = new ItemListed(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }
  if (!activeItem) {
    activeItem = new ActiveItem(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }

  itemListed.seller = event.params.seller;
  itemListed.nftAddress = event.params.nftAddress;
  itemListed.tokenId = event.params.tokenId;
  itemListed.price = event.params.price;
  itemListed.listingId = event.params.listingId;
  itemListed.desiredNftAddress = event.params.desiredNftAddress;
  itemListed.desiredTokenId = event.params.desiredTokenId;

  activeItem.seller = event.params.seller;
  activeItem.nftAddress = event.params.nftAddress;
  activeItem.tokenId = event.params.tokenId;
  activeItem.price = event.params.price;
  activeItem.listingId = event.params.listingId;
  activeItem.buyer = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  ); // !!!W I would prefer to use another event parameter which just says active, sold, or canceled or sth like that. I think using the dead address as a symbol is not professional.
  activeItem.desiredNftAddress = event.params.desiredNftAddress;
  activeItem.desiredTokenId = event.params.desiredTokenId;

  itemListed.save();
  activeItem.save();
}

export function handleItemUpdated(event: ItemUpdatedEvent): void {
  // !!! I added the updated event, since i nmy opinion this is important (patrick doesnt has this for some reason...)
  let itemUpdated = ItemUpdated.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  if (!itemUpdated) {
    itemUpdated = new ItemUpdated(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }
  if (!activeItem) {
    activeItem = new ActiveItem(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }

  itemUpdated.seller = event.params.seller;
  itemUpdated.nftAddress = event.params.nftAddress;
  itemUpdated.tokenId = event.params.tokenId;
  itemUpdated.price = event.params.price;
  itemUpdated.listingId = event.params.listingId;
  itemUpdated.desiredNftAddress = event.params.desiredNftAddress;
  itemUpdated.desiredTokenId = event.params.desiredTokenId;

  activeItem.seller = event.params.seller;
  activeItem.nftAddress = event.params.nftAddress;
  activeItem.tokenId = event.params.tokenId;
  activeItem.price = event.params.price;
  activeItem.listingId = event.params.listingId;
  activeItem.desiredNftAddress = event.params.desiredNftAddress;
  activeItem.desiredTokenId = event.params.desiredTokenId;

  itemUpdated.save();
  activeItem.save();
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString(); // this will result in 0x00x2c9d7f070d03d83588e22c23fe858aa71274ad2a for the first nft !!! but kinda doesnt work bc the token Id doesnt get properly converted to a hex: it counts like 00, 10, 20
}
