import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <div>
            Decentralized lottery
            <ConnectButton moralisAuth={false} />
        </div>
    )
}
