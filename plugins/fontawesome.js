import fontawesome from '@fortawesome/fontawesome'
import { faEdit, faCalendar } from '@fortawesome/fontawesome-free-solid'
// import { faCoffee, faCode } from '@fortawesome/fontawesome-pro-regular';

fontawesome.config = {
  autoAddCss: false
}

fontawesome.library.add(faEdit, faCalendar)
