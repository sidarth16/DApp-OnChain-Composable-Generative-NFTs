import Image from 'next/image'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';

import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

import contractInterface from '../contract-abi.json';
const contractConfig = {
  addressOrName: '0x86fbbb1254c39602a7b067d5ae7e5c2bdfd61a30',
  contractInterface: contractInterface,
};

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
  combId = Number(combId)
  console.log(`combId : ${combId}`);
}

function getSVG(){
  // return(`<svg xmlns="http://www.w3.org/2000/svg" width="750" height="750">
  //            <image id="layer1" href="https://ipfs.io/ipfs/QmWpt47XRV9gCHyQsSehcMCnNrNhirYbiT1bJqXFXcMYMq/${layerOrder[0]}/${document.getElementById('dropdown1').value}.png"/> 
  //            <image id="layer2" href="https://ipfs.io/ipfs/QmWpt47XRV9gCHyQsSehcMCnNrNhirYbiT1bJqXFXcMYMq/${layerOrder[1]}/${document.getElementById('dropdown2').value}.png"/>
  //            <image id="layer3" href="https://ipfs.io/ipfs/QmWpt47XRV9gCHyQsSehcMCnNrNhirYbiT1bJqXFXcMYMq/${layerOrder[2]}/${document.getElementById('dropdown3').value}.png"/>
  //            <image id="layer4" href="https://ipfs.io/ipfs/QmWpt47XRV9gCHyQsSehcMCnNrNhirYbiT1bJqXFXcMYMq/${layerOrder[3]}/${document.getElementById('dropdown4').value}.png"/>
  //            <image id="layer5" href="https://ipfs.io/ipfs/QmWpt47XRV9gCHyQsSehcMCnNrNhirYbiT1bJqXFXcMYMq/${layerOrder[4]}/${document.getElementById('dropdown5').value}.png"/>
  //         </svg>`
  // )

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

  const dna = [
    Attr5.indexOf(document.getElementById('dropdown5').value),
    Attr4.indexOf(document.getElementById('dropdown4').value),
    Attr3.indexOf(document.getElementById('dropdown3').value),
    Attr2.indexOf(document.getElementById('dropdown2').value),
    Attr1.indexOf(document.getElementById('dropdown1').value)
  ]
  const svg = getSVG()
  console.log(svg);
  let newSvg = document.getElementById("svgImage")
  newSvg.innerHTML = getSVG()
}


export default function Home() {

  const [mintStatus, setMintStatus] = useState("Mint");

  const mint = () => {
    //

    setMintStatus("Minting...");


    // finished

    setTimeout(() => {
      setMintStatus("Mint")
    }, 5000);
  }

  return (
    <>
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 12,
      }}
    >
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
          <p style={{ margin: '122px 20 24px' }}>
              10 minted so far!
          </p>
        </div>
        <button id="mint" onClick={mint} className="btn btn-warning m-3 col col-lg-10">{mintStatus}</button>
        </div>
      </div>

    </div>

    {/* <div className="container">
      <div style={{ flex: '1 1 auto' }}>
        <div id = "svgImage"></div>
      </div>
      <div style={{ flex: '0 0 auto' }}>
        <button id="preview" onClick={getPreviewImg} className="btn btn-primary m-3 ">Preview</button>
        <button id="mint" className="btn btn-warning m-3 ">Mint</button>
      </div>
    </div> */}
  </>
  );
}