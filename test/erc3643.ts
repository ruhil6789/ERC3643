import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/Signers";

import {
  TREXFactory, TREXFactory__factory, BasicCompliance, BasicCompliance__factory, DefaultCompliance, DefaultCompliance__factory,
  ClaimTopicsRegistry, ClaimTopicsRegistry__factory, ClaimTopicsRegistryProxy, ClaimTopicsRegistryProxy__factory, IdentityRegistry, IdentityRegistry__factory, IdentityRegistryProxy, IdentityRegistryProxy__factory,
  IdentityRegistryStorageProxy__factory, ImplementationAuthority, ImplementationAuthority__factory, IdentityRegistryStorage, IdentityRegistryStorage__factory,
  ModularComplianceProxy, ModularComplianceProxy__factory, TrustedIssuersRegistry, TrustedIssuersRegistry__factory, TrustedIssuersRegistryProxy, TrustedIssuersRegistryProxy__factory, ModularCompliance, ModularCompliance__factory,
  ClaimIssuer, ClaimIssuer__factory, AgentRole, AgentRole__factory, AgentRoles, AgentManager, AgentManager__factory, Token,
  Token__factory, TokenProxy, TokenProxy__factory, MaxBalanceTest__factory, AgentRoleUpgradeable, AgentRoleUpgradeable__factory, Identity, Identity__factory, AgentRolesUpgradeable, AgentRolesUpgradeable__factory, CountryAllowModule, CountryAllowModule__factory
} from "../typechain-types";
// import {TREXFactory} from "../typechain-types"
// import { compliance } from "../typechain-types";
import { implementation } from "../typechain-types/contracts/registry";

describe("ERC3643 cases", async () => {
  let signers: SignerWithAddress[];
  let modular: ModularCompliance

  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let registry: TrustedIssuersRegistry;
  let manager: AgentManager;
  // let legacy: AgentRoleUpgradeable__factory;

  let IdentityRegistryStorage: IdentityRegistryStorage;
  let implement: ImplementationAuthority;
  let identityRegistry: IdentityRegistry;
  let identity: Identity;

  let factory: TREXFactory;
  let compliance: DefaultCompliance;
  let registryStorage: TrustedIssuersRegistry;
  // let identityRegistery: IdentityRegistryStorage__factory;
  let claim: ClaimTopicsRegistry;
  let trusted: TrustedIssuersRegistry;
  let defaultCompliance: DefaultCompliance;
  let tokenProxy: TokenProxy;
  let token: Token;
  let agents: AgentRoles;
  let agent: AgentRole;
  let AgentRoleUpgradeable: AgentRoleUpgradeable;
  let proxy: TokenProxy;
  let complianceAddress: any;
  let claimAddress: any;
  let trustedAddress: any;
  let identityRegistryAdress: any;
  let AgentRoles: AgentRolesUpgradeable;
  let CountryAllowModule: CountryAllowModule


  // let Signers:SignerWithAddress[]
  // let owner1:SignerWithAddress
  beforeEach(async () => {

    [owner, user1, user2, user3] = await ethers.getSigners();



    console.log("owner", owner.address);
    console.log("user1", user1.address);

    compliance = await new DefaultCompliance__factory(owner).deploy();
    console.log(compliance.address, "compliance address");

    trusted = await new TrustedIssuersRegistry__factory(owner).deploy();
    console.log(trusted.address, "trusted address");

    identityRegistry = await new IdentityRegistry__factory(owner).deploy();
    console.log(identityRegistry.address, "identityRegistry address");

    identity = await new Identity__factory(owner).deploy(owner.address, false);
    console.log(identity.address, "Identity");

    claim = await new ClaimTopicsRegistry__factory(owner).deploy();
    console.log(claim.address, "claimAddress");


    IdentityRegistryStorage = await new IdentityRegistryStorage__factory(owner).deploy();
    await IdentityRegistryStorage.init();

    await trusted.init();
    trusted.addTrustedIssuer(claim.address, [0])


    console.log("token")

    token = await new Token__factory(owner).deploy();
    console.log("token")

    modular = await new ModularCompliance__factory(owner).deploy();
    await modular.init();

    await modular.bindToken(token.address);


    console.log("token address", token.address);
    await claim.init();


    const tokeninit = await token.inittt(identityRegistry.address, compliance.address, "antier", "ant ", 10, "0x0000000000000000000000000000000000000000");
    console.log(tokeninit, "tokeninit");


    await compliance.bindToken(token.address);

    const identityRegistryinit = await identityRegistry.initializee(trusted.address, claim.address, IdentityRegistryStorage.address);
    console.log(identityRegistryinit, "identityRegistryinit");

    const bindIdentityRegistry = await IdentityRegistryStorage.bindIdentityRegistry(identityRegistry.address);
    console.log(bindIdentityRegistry, "bindIdentityRegistry");



  })

  it.skip("token details and calling the mint function", async () => {
    // await token.inittt(identityRegistry.address, compliance.address, "antier", "ant ", 10, "0x0000000000000000000000000000000000000000");
    console.log("-----------------token owner", await token.owner());
    console.log("supply", await token.totalSupply());
    console.log("name------------------", await token.name());
    console.log("---------------decimal", await token.decimals())
    console.log("---------------------compolice", await token.compliance())
    console.log("------------------------------------chainID", await token.onchainID());


    const identityRegistryinit = await identityRegistry.initializee(trusted.address, claim.address, IdentityRegistryStorage.address);
    console.log(identityRegistryinit, "identityRegistryinit");


    const isVerified = await identityRegistry.isVerified(owner.address)
    console.log(isVerified, "isVerified");


    const bindIdentityRegistry = await IdentityRegistryStorage.bindIdentityRegistry(identityRegistry.address);
    console.log(bindIdentityRegistry, "bindIdentityRegistry");

    const adddIdentifyStorage = await IdentityRegistryStorage.addAgent(owner.address);
    console.log(adddIdentifyStorage, "adddIdentifyStorage");

    const addAgentToken = await token.addAgent(owner.address);
    console.log(addAgentToken, "addAgentToken");



    const addIdentityToStorage = await IdentityRegistryStorage.connect(owner).addIdentityToStorage(user1.address, identity.address, 91)
    console.log(addIdentityToStorage, "addIdentityToStorage");


    const modularCanTransfer = await compliance.canTransfer("0x0000000000000000000000000000000000000000", owner.address, 10000000)
    console.log(modularCanTransfer, "modularCanTransfer");

    await token.connect(owner).mint(user1.address, 100000000000)
    const user1balance = await token.balanceOf(user1.address)
    console.log(user1balance, "userbalance");




  })
  it("transfer the token amount", async () => {

    // IdentityRegistryStorage  helps us to maintain a record  of all agent using function add,remove etc
    const adddIdentifyStorage = await IdentityRegistryStorage.addAgent(owner.address);
    console.log(adddIdentifyStorage, "adddIdentifyStorage");

    //  token owner   need to addAgent
    const addAgentToken = await token.addAgent(owner.address);
    console.log(addAgentToken, "addAgentToken");
    const addAgentUser1 = await token.addAgent(user1.address);
    console.log(addAgentUser1, "addAgentUser1");

    //  IdentityRegistryStorage owner need to add the identity of the user to addd into the  IdentityRegistryStorage
    const addIdentityToStorage = await IdentityRegistryStorage.connect(owner).addIdentityToStorage(user1.address, identity.address, 91)
    console.log(addIdentityToStorage, "addIdentityToStorage");
    const addIdentityToStorage2 = await IdentityRegistryStorage.connect(owner).addIdentityToStorage(user2.address, identity.address, 91)

    console.log(addIdentityToStorage2, "addIdentityToStorage2");

    const unpause = await token.connect(owner).unpause()

    console.log(unpause, "unpause");



    const modularCanTransfer = await compliance.canTransfer("0x0000000000000000000000000000000000000000", owner.address, 10000000000)
    console.log(modularCanTransfer, "modularCanTransfer");

    //  token ownewr mint the token to the user1 address
    const mintToken = await token.connect(owner).mint(user1.address, 100000000)
    console.log(mintToken, "mintToken");

    //   token user1address mint the  token to the user2 address
    const mintTokennuser2 = await token.connect(user1).mint(user2.address, 100000000)
    console.log(mintTokennuser2, mintTokennuser2);

    //  identityRegistry need to verifiey that this address is include in the identityRegistry or not   ise this comes after the addIdentityToStorage
    const isVerife = await identityRegistry.isVerified(user1.address)
    console.log(isVerife, "isVerifier");

    const isVerifee = await identityRegistry.isVerified(user2.address)
    console.log(isVerifee, "isVerifier");

    //  token owner can transfer the token from owner to user2 after verification  from the  identityRegistry
    const transferToken = await token.connect(user1).transfer(user2.address, 5000000)
    console.log(transferToken, "transfer");


    const user1balance = await token.balanceOf(user1.address)
    console.log(user1balance, "userbalance");
    const user1balance2 = await token.balanceOf(user2.address)
    console.log(user1balance2, "userbalance2");

  })


  it.only("forced transfer", async () => {

    // IdentityRegistryStorage  helps us to maintain a record  of all agent using function add,remove etc
    const adddIdentifyStorage = await IdentityRegistryStorage.addAgent(owner.address);
    console.log(adddIdentifyStorage, "adddIdentifyStorage");

    //  token owner   need to addAgent
    const addAgentToken = await token.addAgent(owner.address);
    console.log(addAgentToken, "addAgentToken");
    const addAgentUser1 = await token.addAgent(user1.address);
    console.log(addAgentUser1, "addAgentUser1");

    //  IdentityRegistryStorage owner need to add the identity of the user to addd into the  IdentityRegistryStorage
    const addIdentityToStorage = await IdentityRegistryStorage.connect(owner).addIdentityToStorage(user1.address, identity.address, 91)
    console.log(addIdentityToStorage, "addIdentityToStorage");
    const addIdentityToStorage2 = await IdentityRegistryStorage.connect(owner).addIdentityToStorage(user2.address, identity.address, 91)

    console.log(addIdentityToStorage2, "addIdentityToStorage2");

    const addIdentityToStorage3 = await IdentityRegistryStorage.connect(owner).addIdentityToStorage(user3.address, identity.address, 91)
    console.log(addIdentityToStorage3, "addIdentityToStorage3");

    const unpause = await token.connect(owner).unpause()

    console.log(unpause, "unpause");



    const modularCanTransfer = await compliance.canTransfer("0x0000000000000000000000000000000000000000", owner.address, 10000000000)
    console.log(modularCanTransfer, "modularCanTransfer");

    //  token ownewr mint the token to the user1 address
    const mintToken = await token.connect(owner).mint(user1.address, 10000000000)
    console.log(mintToken, "mintToken");

    //   token user1address mint the  token to the user2 address
    const mintTokennuser2 = await token.connect(user1).mint(user2.address, 100000000)
    console.log(mintTokennuser2, mintTokennuser2);

    //  identityRegistry need to verifiey that this address is include in the identityRegistry or not   ise this comes after the addIdentityToStorage
    const isVerified1 = await identityRegistry.isVerified(user1.address)
    console.log(isVerified1, "isVerified1");

    const isVerified2 = await identityRegistry.isVerified(user2.address)
    console.log(isVerified2, "isVerified2");

    const isVerified3 = await identityRegistry.isVerified(user3.address)
    console.log(isVerified3, "isVerified3");
    // //  token owner can transfer the token from owner to user2 after verification  from the  identityRegistry
    // const transferToken = await token.connect(user1).transfer(user2.address, 5000000)
    // console.log(transferToken, "transfer");
    
    const transferToken = await token.connect(user1).forcedTransfer(user1.address,user2.address, 15000000)
    console.log(transferToken,"transferToken");


    const user1balance = await token.balanceOf(user1.address)
    console.log(user1balance, "userbalance");
    const user1balance2 = await token.balanceOf(user2.address)
    console.log(user1balance2, "userbalance2");
    const user1balance3 = await token.balanceOf(user3.address)
    console.log(user1balance3, "userbalance3");

  })
})