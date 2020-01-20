module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      host: "127.0.0.1", // Connect to geth on the specified
      port: 8547,
      from: "0x67545c0e79FdDe0E700860ea504D216ff475Af1B", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 8000000 // Gas limit used for deploys
    }
  }
};
