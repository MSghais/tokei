import {
  constants,
  Provider,
  Contract,
  Account,
  json,
  shortString,
  RpcProvider,
  hash,
} from "starknet";
import fs from "fs";

async function main() {
  // Initialize RPC provider with a specified node URL (Goerli testnet in this case)
  const provider = new RpcProvider({
    nodeUrl: "SN_GOERLI",
  });

  // Check that communication with provider is OK
  const ci = await provider.getChainId();
  console.log("chain Id =", ci);

  // initialize existing Argent X testnet  account
  const accountAddress =
    "0x05D20A56d451F02B50486B7d7B2b3F25F5A594Da8AA620Ca599fd65E7312b7F4";
  const privateKey =
    "0x06ab1f177bbf6b9d862412f0ec4feb0bdc520c7712f5a25c3e043cbaa29410db";

  const account0 = new Account(provider, accountAddress, privateKey);
  console.log("existing_ACCOUNT_ADDRESS=", accountAddress);
  console.log("existing account connected.\n");

  // Parse the compiled contract files
  const compiledSierra = json.parse(
    fs
      .readFileSync("target/dev/tokei_TokeiLockupLinear.contract_class.json")
      .toString("ascii")
  );
  const compiledCasm = json.parse(
    fs
      .readFileSync(
        "target/dev/tokei_TokeiLockupLinear.compiled_contract_class.json"
      )
      .toString("ascii")
  );

  //**************************************************************************************** */
  // Since we already have the classhash we will be skipping this part
  // Declare the contract

  // const ch = hash.computeSierraContractClassHash(compiledSierra);
  // console.log("Class hash calc =", ch);
  // const compCH = hash.computeCompiledClassHash(compiledCasm);
  // console.log("compiled class hash =", compCH);
  // const declareResponse = await account0.declare({
  //   contract: compiledSierra,
  //   casm: compiledCasm,
  // });
  // const contractClassHash = declareResponse.class_hash;

  // // Wait for the transaction to be confirmed and log the transaction receipt
  // const txR = await provider.waitForTransaction(
  //   declareResponse.transaction_hash
  // );
  // console.log("tx receipt =", txR);

  //**************************************************************************************** */

  const contractClassHash =
    "0x01f9313b620810859fb1aa2b6920bb80a00d6bf5b13d1329b9a82424c8c272ab";

  console.log("✅ Test Contract declared with classHash =", contractClassHash);

  console.log("Deploy of contract in progress...");
  const { transaction_hash: th2, address } = await account0.deployContract({
    classHash: contractClassHash,
    constructorCalldata: [accountAddress],
  });
  console.log("🚀 contract_address =", address);
  // Wait for the deployment transaction to be confirmed
  await provider.waitForTransaction(th2);

  console.log("✅ Test completed.");
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//Deployed Address
// Updated deployed contract_address : 0x04bf83b5554b165b5f0ff5e797a8f57162840c78915b4864bdbfbdc71649ef1b on goerli
