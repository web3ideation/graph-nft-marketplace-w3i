import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
  ItemUpdated as ItemUpdatedEvent,
} from "../generated/NftMarketplace/NftMarketplace"
import {
  ItemBought,
  ItemCanceled,
  ItemListed,
  ItemUpdated,
  ActiveItem
} from "../generated/schema"

export function handleItemBought(event: ItemBoughtEvent): void {
  let itemBought = ItemBought.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  if (!itemBought) {
    itemBought = new ItemBought(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }
  itemBought.buyer = event.params.buyer
  itemBought.nftAddress = event.params.nftAddress
  itemBought.tokenId = event.params.tokenId
  itemBought.listingId = event.params.listingId
  // itemBought.price = event.params.price

  activeItem!.buyer = event.params.buyer

  itemBought.save()
  activeItem!.save()
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  let itemCanceled = ItemCanceled.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  if (!itemCanceled) {
    itemCanceled = new ItemCanceled(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }
  itemCanceled.seller = event.params.seller
  itemCanceled.nftAddress = event.params.nftAddress
  itemCanceled.tokenId = event.params.tokenId
  itemCanceled.listingId = event.params.listingId
  // itemCanceled.price = event.params.price

  activeItem!.buyer = Address.fromString("0x000000000000000000000000000000000000dEaD") // !!! check if active items have the 0x0000000000000000000000000000000000000000 as their buyer rather thand the dEaD address. Bc if not i could just use the 0x0000000000000000000000000000000000000000 here.

  itemCanceled.save()
  activeItem!.save()
}

export function handleItemListed(event: ItemListedEvent): void {
  let itemListed = ItemListed.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  if (!itemListed) {
    itemListed = new ItemListed(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }
  if (!activeItem) {
    activeItem = new ActiveItem(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }

  itemListed.seller = event.params.seller
  itemListed.nftAddress = event.params.nftAddress
  itemListed.tokenId = event.params.tokenId
  itemListed.price = event.params.price
  itemListed.listingId = event.params.listingId

  activeItem.seller = event.params.seller
  activeItem.nftAddress = event.params.nftAddress
  activeItem.tokenId = event.params.tokenId
  activeItem.price = event.params.price
  activeItem.listingId = event.params.listingId


  itemListed.save()
  activeItem!.save()
}

export function handleItemUpdated(event: ItemUpdatedEvent): void { // !!! I added the updated event, since i nmy opinion this is important (patrick doesnt has this for some reason...)
  let itemUpdated = ItemUpdated.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  if (!itemUpdated) {
    itemUpdated = new ItemUpdated(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }
  if (!activeItem) {
    activeItem = new ActiveItem(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }

  itemUpdated.seller = event.params.seller
  itemUpdated.nftAddress = event.params.nftAddress
  itemUpdated.tokenId = event.params.tokenId
  itemUpdated.price = event.params.price
  itemUpdated.listingId = event.params.listingId

  activeItem.seller = event.params.seller
  activeItem.nftAddress = event.params.nftAddress
  activeItem.tokenId = event.params.tokenId
  activeItem.price = event.params.price
  activeItem.listingId = event.params.listingId


  itemUpdated.save()
  activeItem!.save()
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString() // !!! does this mathematically add the nftAddress to the tokenId or does it just write the two numbers together?
}
