this is the graph code repo for the nftMarketplace Next JS Frontend which has already been deployed to the graph.

I already updated the events, now this has to be deployed to the subgraph:

graph auth --studio <Deploy-Key> // get the deploymentkey from the subgraph studio website
graph codegen // to make sure the schema.graphql looks good
graph build
graph deploy --studio nft-marketplace
v0.0.1
