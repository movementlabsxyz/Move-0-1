const { Account, Aptos, AptosConfig, Network, Ed25519PrivateKey } = require("@aptos-labs/ts-sdk");

// Define the custom network configuration
const config = new AptosConfig({ 
    network: Network.CUSTOM,
    fullnode: 'https://aptos.testnet.suzuka.movementlabs.xyz/v1',
    faucet: 'https://faucet.testnet.suzuka.movementlabs.xyz',
});

// Define the module address and functions
const MODULE_ADDRESS = "0xc29415b849fa1173b986fdd074335b9fcc5b2b795d84163be06656cd903c3c01";
const SET_MESSAGE_FUNCTION = `${MODULE_ADDRESS}::message::set_message`;
const GET_MESSAGE_FUNCTION = `${MODULE_ADDRESS}::message::get_message`;

const PRIVATE_KEY = ""; // Replace with your private key
const MESSAGE = "let's get MOVEing";

const setMessage = async () => {
  // Setup the client
  const aptos = new Aptos(config);

  // Create an account from the provided private key
  console.log("creating")
  const privateKey = new Ed25519PrivateKey(PRIVATE_KEY)
  const account = Account.fromPrivateKey({ privateKey })
  const accountAddress = account.accountAddress

  console.log(`address: ${account.accountAddress}`)

  console.log(`Using account: ${accountAddress}`);

  // Build the transaction payload
  const payload = {
    function: SET_MESSAGE_FUNCTION,
    type_arguments: [],
    arguments: [MESSAGE],
  };

  console.log("\n=== Reading Message ===\n");
  const viewPayload = {
    function: GET_MESSAGE_FUNCTION,
    functionArguments: [accountAddress]
  }
  const message = await aptos.view({ payload: viewPayload });

  console.log("Message:", message);

  // Submit the transaction
  console.log("\n=== Submitting Transaction ===\n");
  const transaction = await aptos.transaction.build.simple({
    sender: accountAddress,
    data: {
      function: SET_MESSAGE_FUNCTION,
      functionArguments: [MESSAGE]
    },
  });

  // Sign the transaction
  const signature = aptos.transaction.sign({ signer: account, transaction });

  // Submit the transaction to chain
  const committedTxn = await aptos.transaction.submit.simple({
    transaction,
    senderAuthenticator: signature,
  });

  console.log(`Submitted transaction: ${committedTxn.hash}`);
  const response = await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
  console.log({ response })
  // Read the message after it has been set
  console.log("\n=== Reading Message ===\n");

  const newMessage = await aptos.view({ payload: viewPayload });

  console.log("Message:", newMessage);
};

setMessage().catch((err) => {
  console.error("Error setting message:", err);
});