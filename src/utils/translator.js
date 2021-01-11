import Fr from './french.json'
import Es from './spanish.json'
import En from './english.json'
import Pt from './portugese.json'

const translate = entry =>  {
    switch (localStorage.getItem('userLang')) {
        case 'fr':
            return Fr[entry]
            
        case 'en':
            return En[entry]
            
        case 'es':
            return Es[entry]
            
        case 'pt':
            return Pt[entry]
            
        default:
            return entry
    }
}

export default translate
