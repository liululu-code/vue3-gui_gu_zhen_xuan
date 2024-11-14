import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'

const useLayoutSetting = defineStore('layoutSetting', () => {

    let isFold: Ref<boolean> = ref(false);
    let refrush = ref(false);
    return {
        isFold,
        refrush,
        
    }
})

export default useLayoutSetting