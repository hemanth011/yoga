import React from 'react'
import HeroContainer from './Hero/HeroContainer'
import Gallary from './Gallary/Gallary'
import PopularClasses from './PopularClasses/PopularClasses'
import Popularteacher from './Popularteacher/Popularteacher'

const Homa = () => {
  return (
    <section>
      <HeroContainer/>
      <div className="max-w-screen-xl mx-auto">
     <Gallary/>
    <PopularClasses/>
    <Popularteacher/>
      </div>
    </section>
  )
}

export default Homa