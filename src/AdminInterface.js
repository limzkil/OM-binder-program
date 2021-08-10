import LogoHead from './interfaceComponents/LogoHead'
import DisplayArea from './interfaceComponents/DisplayArea'
import MongoSidebar from './interfaceComponents/MongoSidebar'
import CUDButtons from './interfaceComponents/CUDButtons'

export default function AdminInterface() {

    return (<>
    <LogoHead />
    <DisplayArea />
    <MongoSidebar />
    <CUDButtons />
    
    </>)

}