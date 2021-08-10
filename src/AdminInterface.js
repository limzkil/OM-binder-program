import LogoHead from './interface components/LogoHead'
import DisplayArea from './interface components/DisplayArea'
import MongoSidebar from './interface components/MongoSidebar'
import CUDButtons from './interface components/CUDButtons'

export default function AdminInterface() {

    return (<>
    <LogoHead />
    <DisplayArea />
    <MongoSidebar />
    <CUDButtons />
    
    </>)

}