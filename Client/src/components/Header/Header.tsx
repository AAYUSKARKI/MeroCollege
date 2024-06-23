
import SparklesText from "../magicui/sparkles-text"
import { useNavigate } from "react-router-dom"
function Header() {
    const navigate = useNavigate()
    const handleLogoClick=()=>{
        navigate('/')
    }
  return (
    <>
    <div onClick={handleLogoClick} className="relative top-0 left-0 p-5 cursor-pointer">
    <SparklesText className="text-3xl" text="Mero College" />
    </div>
    </>
  )
}

export default Header