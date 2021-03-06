
import React, { Component, Fragment } from 'react'
import jsonFormat from 'json-format'

import WalletCreationStepPlate from 'components/WalletCreationStepPlate'
import { pipe } from 'utils/Functional'
import { download } from 'utils/misc'
import { caver } from 'klaytn/caver'

type Props = {

}

class WalletCreationStep2 extends Component<Props> {
  constructor(props) {
    super(props)
    const walletData = caver.klay.accounts.create()
    this.state = {
      privateKey :walletData.privateKey,
      address:walletData.address,
      walletData:walletData
    }
  }

  handleDownload = () => {
    const { privateKey, walletData} = this.state
    const { password, receiptWallet, walletDataUpdate, pageType, madePrivateKey} = this.props
    
    const HRAaddress = {}
    if(pageType == 'HRAType'){
      this.setState({privateKey: madePrivateKey  })
      HRAaddress.address = caver.utils.hexToUtf8(receiptWallet.to)
    }
    const keystore = caver.klay.accounts.encrypt(privateKey, password, HRAaddress)
    if(HRAaddress.address){
      walletDataUpdate({
        HRAaddress: HRAaddress.address
      })
    }
    walletDataUpdate(walletData)
    // If user clicked download, clear previous wallet instance.
    this.downloadKeystore(keystore)
  }

  downloadKeystore = (keystore) => {
    const date = new Date()
    const address = keystore.addressAsHumanReadableString ? keystore.addressAsHumanReadableString : keystore.address
    const fileName = `keystore-${address}-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.json`
    
    download(jsonFormat(keystore), fileName)
  }

  render() {
    const { nameSet} = this.state
    const { handleStepMove, pageType } = this.props
    return (
      <WalletCreationStepPlate
        stepName="STEP 2"
        title={(
          <Fragment>
            Please Download Keystore File
          </Fragment>
        )}
        description={(
          <Fragment>
            The password for your keystore file has been set.<br />
            Click the button below to download the file and move on to the final step.
          </Fragment>
        )}
        nextStepButtons={[
          { title: 'Download & Next Step', onClick: pipe(this.handleDownload,handleStepMove(3))}
        ]}
      />
    )
  }
}

export default WalletCreationStep2
