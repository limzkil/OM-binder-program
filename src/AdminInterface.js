import LogoHead from './interface components/LogoHead'
import TabNav from './interface components/TabNav'
import DisplayArea from './interface components/DisplayArea'
import MongoSidebar from './interface components/MongoSidebar'
import CUDButtons from './interface components/CUDButtons'

export default function AdminInterface() {

    return (<>
    <LogoHead />
    <TabNav />
    <DisplayArea />
    <MongoSidebar />
    <CUDButtons />
    
    </>)

}