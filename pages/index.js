import Image from 'next/image'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState,useEffect } from 'react';
import React from 'react';
import { ethers ,utils} from 'ethers'

const nftContractAddress = '0xDE37729785107122FfbF8f815C802B93B02ceC75'
import contractInterface from '../contract-abi.json';

const layerOrder   = ["Background", "Jersey", "HeadGear", "EyeWear", "Pendant"];
const Attr1 = ["None","Floodlights", "Mars", "Neon", "Stands"];
const Attr2 = ["None","Bullish", "Ethereum", "Test", "ODI"];
const Attr3 = ["None", "Blue", "Camo", "Mask", "NavyBlue"];
const Attr4 = ["None", "Neon", "Vue", "VR", "ThugLife"];
const Attr5 = ["None", "Emerald", "Pearl", "Bitcoin", "Key"];

function getCombId(){
  const dna = [
    Attr5.indexOf(document.getElementById('dropdown5').value),
    Attr4.indexOf(document.getElementById('dropdown4').value),
    Attr3.indexOf(document.getElementById('dropdown3').value),
    Attr2.indexOf(document.getElementById('dropdown2').value),
    Attr1.indexOf(document.getElementById('dropdown1').value)
  ]

  let combId = dna.join("")
  // combId = Number(combId)
  console.log(`combId : ${combId}`);
  return combId;
}

function getSVG(){
  // return(`<svg xmlns="http://www.w3.org/2000/svg" width="750" height="750">
  //            <image id="layer1" href="https://ipfs.io/ipfs/QmWpt47XRV9gCHyQsSehcMCnNrNhirYbiT1bJqXFXcMYMq/${layerOrder[0]}/${document.getElementById('dropdown1').value}.png"/> 
  //            <image id="layer2" href="https://ipfs.io/ipfs/QmWpt47XRV9gCHyQsSehcMCnNrNhirYbiT1bJqXFXcMYMq/${layerOrder[1]}/${document.getElementById('dropdown2').value}.png"/>
  //            <image id="layer3" href="https://ipfs.io/ipfs/QmWpt47XRV9gCHyQsSehcMCnNrNhirYbiT1bJqXFXcMYMq/${layerOrder[2]}/${document.getElementById('dropdown3').value}.png"/>
  //            <image id="layer4" href="https://ipfs.io/ipfs/QmWpt47XRV9gCHyQsSehcMCnNrNhirYbiT1bJqXFXcMYMq/${layerOrder[3]}/${document.getElementById('dropdown4').value}.png"/>
  //            <image id="layer5" href="https://ipfs.io/ipfs/QmWpt47XRV9gCHyQsSehcMCnNrNhirYbiT1bJqXFXcMYMq/${layerOrder[4]}/${document.getElementById('dropdown5').value}.png"/>
  //         </svg>`)

  return( 
    ` <svg xmlns="http://www.w3.org/2000/svg" width="750" height="750">
        <image id="layer1" href="./assets/${layerOrder[0]}/${document.getElementById('dropdown1').value}.png"/> 
        <image id="layer2" href="./assets/${layerOrder[1]}/${document.getElementById('dropdown2').value}.png"/>
        <image id="layer3" href="./assets/${layerOrder[2]}/${document.getElementById('dropdown3').value}.png"/>
        <image id="layer4" href="./assets/${layerOrder[3]}/${document.getElementById('dropdown4').value}.png"/>
        <image id="layer5" href="./assets/${layerOrder[4]}/${document.getElementById('dropdown5').value}.png"/>
      </svg>
    `
  )
}

function getPreviewImg(){
  document.getElementById("status").innerHTML = ""
  // const dna = [
  //   Attr5.indexOf(document.getElementById('dropdown5').value),
  //   Attr4.indexOf(document.getElementById('dropdown4').value),
  //   Attr3.indexOf(document.getElementById('dropdown3').value),
  //   Attr2.indexOf(document.getElementById('dropdown2').value),
  //   Attr1.indexOf(document.getElementById('dropdown1').value)
  // ]
  const svg = getSVG()
  console.log(svg);
  let newSvg = document.getElementById("svgImage")
  newSvg.innerHTML = getSVG()
}

export default function Home() {
  
  const [mintStatus, setMintVal] = useState("Mint")
	const [miningStatus, setMiningStatus] = useState(null)
	const [loadingState, setLoadingState] = useState(0)
	const [txError, setTxError] = useState(null)
  const [walletAddress, setWalletAddress] = useState('Connect')
  const [totalMinted, setTotalMinted] = useState(0);

  useEffect(() => {
      requestAccount()
      updateTotalMinted()
      getPreviewImg()
    }, []);

  async function updateTotalMinted(){
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const nftContract = new ethers.Contract(
        nftContractAddress,
        contractInterface,
        provider
      );
      console.log("$$$$:",nftContract);
      const tm = await nftContract.totalMinted()
      console.log("############:",tm.toString());
      setTotalMinted(tm.toString());
    }
    else{
      setTotalMinted("0"); 
    }
  }

  async function requestAccount() {
    if (window.ethereum) {
        try {
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(handleAccountsChanged)
                .catch((err) => {
                    console.error(err);
                });
            await window.ethereum.on('accountsChanged', handleAccountsChanged);
            async function handleAccountsChanged(accounts) {
                console.log('total wallet address available: ', accounts);
                if (accounts.length === 0) {
                  console.log('Please connect to MetaMask.');
                } else if (accounts[0] !== walletAddress) {
                  setWalletAddress(accounts[0])
                  console.log("address ", walletAddress);
                  return console.log('accounts', await accounts);
                }
            };
            return;
        } catch (error) {
            return (
                <h1>error.message</h1>
            )
        }
    }
  }
  

  // Creates transaction to mint NFT on clicking Mint Character button
	const nftMint = async () => {
		try {
      getPreviewImg()
      document.getElementById("status").innerHTML = ""
      const combId = getCombId();
      console.log(`====> CombId : ${combId}`);
			const { ethereum } = window

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const nftContract = new ethers.Contract(
					nftContractAddress,
					contractInterface,
					signer
				)

				let nftTx = await nftContract.nftMint(combId,{"gasPrice":30000000000})
				console.log('Mining....', nftTx.hash)
				setMiningStatus(0)
        setMintVal('... Minting ... ')

				let tx = await nftTx.wait()
				setLoadingState(1)
				console.log('Mined!', tx)
				let event = tx.events[0]
				let value = event.args[2]
				let tokenId = value.toNumber()

				console.log(
					`Mined, see transaction: https://mumbai.polygonscan.com/tx/${nftTx.hash}`
				)

        // View transaction : <a href="https://rinkeby.etherscan.io/tx/${nftTx.hash}"> ${nftTx.hash} </a>`
        document.getElementById("status").innerHTML = `Minted Successfully`;
                                                      // View transaction : https://rinkeby.etherscan.io/tx/${nftTx.hash}`
        updateTotalMinted()
        setMintVal('Mint')

			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error minting character', error)
			setTxError(error.message)
      document.getElementById("status").innerHTML = txError
		}
	}


  return (
    <>
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 1,
      }}
      >
      {/* <button id="connect" className="btn btn-primary m-3">{walletAddress}</button>   */}
      <ConnectButton />
    </div>

    <div className="container">
      <br/><br/>
      <div className = "row">
        <div className = "col">
          <h5>{layerOrder[0]}</h5>
          <select id="dropdown1" className="form-control-lg col">
            <option>{Attr1[0]}</option>
            <option>{Attr1[1]}</option>
            <option>{Attr1[2]}</option>
            <option>{Attr1[3]}</option>
            <option>{Attr1[4]}</option>
          </select>
        </div>

        <div className = "col">
          <h5>{layerOrder[1]}</h5>
          <select id="dropdown2" className="form-control-lg col">
            <option>{Attr2[1]}</option>
            <option>{Attr2[2]}</option>
            <option>{Attr2[3]}</option>
            <option>{Attr2[4]}</option>
          </select>
        </div>

        <div className = "col">
          <h5>HeadGear</h5>
          <select id="dropdown3" className="form-control-lg col">
            <option>{Attr3[0]}</option>
            <option>{Attr3[1]}</option>
            <option>{Attr3[2]}</option>
            <option>{Attr3[3]}</option>
            <option>{Attr3[4]}</option>
          </select>
        </div>

        <div className = "col">
           <h5>EyeWear</h5>
          <select id="dropdown4" className="form-control-lg col">
            <option>{Attr4[0]}</option>
            <option>{Attr4[1]}</option>
            <option>{Attr4[2]}</option>
            <option>{Attr4[3]}</option>
            <option>{Attr4[4]}</option>
          </select>
        </div>

        <div className = "col">
          <h5>Pendant</h5>
          <select id="dropdown5" className="form-control-lg col">
            <option>{Attr5[0]}</option>
            <option>{Attr5[1]}</option>
            <option>{Attr5[2]}</option>
            <option>{Attr5[3]}</option>
            <option>{Attr5[4]}</option>
          </select>
        </div>
      </div>
    </div>
    <br/>
    <div className="container">
      <div className="row">
        <br/>
        <div id = "svgImage" className="col-sm"></div>
        <div className='col-sm'>
        <button id="preview" onClick={getPreviewImg} className="btn btn-primary m-3 col col-lg-10">Preview</button>
        <div>
          <div style={{ display: 'flex',justifyContent: 'center'}}>
            {totalMinted} NFT minted so far!
            ( <a href='https://testnets.opensea.io/collection/testplayersmcl-vvmt6vtgbe'>   Click here to check Opensea </a> )  
          </div>
          
        </div>        
        <button id="mint" className="btn btn-warning m-3 col col-lg-10" onClick={nftMint}>
            {mintStatus}
        </button>
        <div id="status" style={{display: 'flex', justifyContent: 'center'}}></div>
        </div>
      </div>

    </div>
  </>
  );
}