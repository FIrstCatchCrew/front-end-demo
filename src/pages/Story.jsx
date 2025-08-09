import BackButton from "../components/BackButton"
import ParallaxImage from "../components/ParallaxImage"

const Story = () => {
  return (
    <>
    <div className="storypage">
    <div class="picbox1"><img src="src/assets/images/capelin.jpeg" alt=""/>
    <img src="src/assets/images/fishers.jpeg" alt=""/></div>
    
    <div class="storybox"><p>The mission of FIRST CATCH is to allow Newfoundlanders to enjoy more Newfoundland fish. It was common for generations
        to meet Fishers at the wharf as they return with their catches, to access the freshest fish at reasonable prices.  Unfortunately too few Newfoundlanders 
        have this opportunity today, so we bring the wharf to you. With no fees or extra costs, we provide access to the finest bounty of the North Atlantic
        on your phone, putting you in direct contact with our partner Fishers, and utilizing low cost, local transport to <b>guarantee</b> 24 hr delivery to your home. 
        <br/>
        <br/>
       <span><q><i>Give a man a fish and you feed him for a day, <br/> teach a man to fish and you feed him for a lifetime</i></q> </span>
    </p></div>
   
        <div class="picbox2"><img src="src/assets/images/buying.jpeg" alt=""/>
            <img src="src/assets/images/sunset.jpeg" alt=""/></div>

    </div>

    <BackButton />


    </>
  )
}

export default Story
