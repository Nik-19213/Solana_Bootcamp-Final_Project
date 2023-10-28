import {
    Connection,
    Keypair,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
  } from "@solana/web3.js";
  import * as fs from "fs/promises";
  import * as path from "path";
  import * as os from "os";
  import {
    burnSendAndConfirm,
    CslSplTokenPDAs,
    deriveAviationNftmetadataPDA,
    getAviationNftmetadata,
    initializeClient,
    mintSendAndConfirm,
    transferSendAndConfirm,
  } from "./index";
  import {
    getMinimumBalanceForRentExemptAccount,
    getMint,
    TOKEN_PROGRAM_ID,
  } from "@solana/spl-token";
  
  async function main(feePayer: Keypair) {
    const args = process.argv.slice(2);
    const connection = new Connection("https://api.devnet.solana.com", {
      commitment: "confirmed",
    });
  
    const progId = new PublicKey(args[0]!);
  
    initializeClient(progId, connection);
  
    /**
     * Create a keypair for the AVN NFT mint
     */
    const avnMint = Keypair.generate();
    console.info("+==== AVN NFT Mint Address  ====+");
    console.info(avnMint.publicKey.toBase58());
  
    /**
     * Create two wallets
     */
    const johnDoeWallet = Keypair.generate();
    console.info("+==== John Doe Wallet ====+");
    console.info(johnDoeWallet.publicKey.toBase58());
  
    const janeDoeWallet = Keypair.generate();
    console.info("+==== Jane Doe Wallet ====+");
    console.info(janeDoeWallet.publicKey.toBase58());
  
    const rent = await getMinimumBalanceForRentExemptAccount(connection);
    await sendAndConfirmTransaction(
      connection,
      new Transaction()
        .add(
          SystemProgram.createAccount({
            fromPubkey: feePayer.publicKey,
            newAccountPubkey: johnDoeWallet.publicKey,
            space: 0,
            lamports: rent,
            programId: SystemProgram.programId,
          })
        )
        .add(
          SystemProgram.createAccount({
            fromPubkey: feePayer.publicKey,
            newAccountPubkey: janeDoeWallet.publicKey,
            space: 0,
            lamports: rent,
            programId: SystemProgram.programId,
          })
        ),
      [feePayer, johnDoeWallet, janeDoeWallet]
    );
  
    /**
     * Derive the AVN NFT Metadata so we can retrieve it later
     */
    const [avnPub] = deriveAviationNftmetadataPDA(
      {
        mint: avnMint.publicKey,
      },
      progId
    );
    console.info("+==== AVN NFT Metadata Address ====+");
    console.info(avnPub.toBase58());
  
    /**
     * Derive John Doe's Associated Token Account, this account will be
     * holding the minted NFT.
     */
    const [johnDoeATA] = CslSplTokenPDAs.deriveAccountPDA({
      wallet: johnDoeWallet.publicKey,
      mint: avnMint.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    });
    console.info("+==== John Doe ATA ====+");
    console.info(johnDoeATA.toBase58());
  
    /**
     * Derive Jane Doe's Associated Token Account, this account will be
     * holding the minted NFT when John Doe transfers it
     */
    const [janeDoeATA] = CslSplTokenPDAs.deriveAccountPDA({
      wallet: janeDoeWallet.publicKey,
      mint: avnMint.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    });
    console.info("+==== Jane Doe ATA ====+");
    console.info(janeDoeATA.toBase58());
  
    /**
     * Mint a new NFT into John's wallet (technically, the Associated Token Account)
     */
    console.info("+==== Minting... ====+");
    await mintSendAndConfirm({
      wallet: johnDoeWallet.publicKey,
      assocTokenAccount: johnDoeATA,
      aircraftType: "Mirage",
      flightRoute: "J&K to Rajasthan",
      description: "Only possible to collect from Battle of Kargil",
      signers: {
        feePayer: feePayer,
        funding: feePayer,
        mint: avnMint,
        owner: johnDoeWallet,
      },
    });
    console.info("+==== Minted ====+");
  
    /**
     * Get the minted token
     */
    let avnMintAccount = await getMint(connection, avnMint.publicKey);
    console.info("+==== AVN NFT Mint ====+");
    console.info(avnMintAccount);
  
    /**
     * Get the AVN NFT Metadata
     */
    let avnMetadata = await getAviationNftmetadata(avnPub);
    console.info("+==== AVN NFT Metadata ====+");
    console.info(avnMetadata);
    console.assert(avnMetadata!.assocAccount!.toBase58(), janeDoeATA.toBase58());
  
    /**
     * Transfer John Doe's NFT to Jane Doe Wallet (technically, the Associated Token Account)
     */
    console.info("+==== Transferring... ====+");
    await transferSendAndConfirm({
      wallet: janeDoeWallet.publicKey,
      assocTokenAccount: janeDoeATA,
      mint: avnMint.publicKey,
      source: johnDoeATA,
      destination: janeDoeATA,
      signers: {
        feePayer: feePayer,
        funding: feePayer,
        authority: johnDoeWallet,
      },
    });
    console.info("+==== Transferred ====+");
  
    /**
     * Get the minted token
     */
    avnMintAccount = await getMint(connection, avnMint.publicKey);
    console.info("+==== AVN NFT Mint ====+");
    console.info(avnMintAccount);
  
    /**
     * Get the AVN NFT Metadata
     */
    avnMetadata = await getAviationNftmetadata(avnPub);
    console.info("+==== AVN NFT Metadata ====+");
    console.info(avnMetadata);
    console.assert(typeof avnMetadata!.assocAccount, "undefined");
  
    /**
     * Burn the NFT
     */
    console.info("+==== Burning... ====+");
    await burnSendAndConfirm({
      mint: avnMint.publicKey,
      wallet: janeDoeWallet.publicKey,
      signers: {
        feePayer: feePayer,
        owner: janeDoeWallet,
      },
    });
    console.info("+==== Burned ====+");
  
    /**
     * Get the minted token
     */
    avnMintAccount = await getMint(connection, avnMint.publicKey);
    console.info("+==== AVN NFT Mint ====+");
    console.info(avnMintAccount);
  
    /**
     * Get the AVN NFT Metadata
     */
    avnMetadata = await getAviationNftmetadata(avnPub);
    console.info("+==== AVN NFT Metadata ====+");
    console.info(avnMetadata);
    console.assert(typeof avnMetadata!.assocAccount, "undefined");
  }
  
  fs.readFile(path.join(os.homedir(), ".config/solana/id.json")).then((file) =>
    main(Keypair.fromSecretKey(new Uint8Array(JSON.parse(file.toString())))
    )
  );
  