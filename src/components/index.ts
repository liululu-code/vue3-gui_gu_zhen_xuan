import SvgIcon from '@/components/myComponents/SvgIcon/SvgIcon.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const allComponents:any = {SvgIcon}

export default {
    install: (app:any) => {
        // console.log(allComponents);
        Object.keys(allComponents).forEach(key=>{
            app.component(key, allComponents[key])
        })

        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
          }
        
    }
}