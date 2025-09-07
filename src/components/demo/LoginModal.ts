import {getModel} from "@/components/modal";
import  UseFormTest from "@/components/demo/UseFormTest.vue";

const idx = Symbol("LoginModal");

export const useLoginModal = () => {

  const modal = getModel<InstanceType<typeof UseFormTest>, null>({
    idx,
    width: '800px',
    title: '登录信息',
    showClose: false,
    draggable: true,
    content: UseFormTest
  })

  modal.onConfirm( async () => {
    if (modal.componentRef.value) {
      const data = await modal.componentRef.value.handleSubmit()
      console.log('data',data)
    }
  })

  return modal;
}
