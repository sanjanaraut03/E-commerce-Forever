import React from 'react'
import { Hero1 } from '../Components/Hero1/Hero1'
import { Popular } from '../Components/Popular/Popular'
import { Offers } from '../Components/Offers/Offers'
import { NewCollections } from '../Components/NewCollections/NewCollections'
import { NewsLetter } from '../Components/NewsLetter/NewsLetter'

export const Shop = () => {
  return (
    <div>
   <Hero1/>
   <Popular/>   
<Offers></Offers>
<NewCollections/>
<NewsLetter/>

    </div>
  )
}
