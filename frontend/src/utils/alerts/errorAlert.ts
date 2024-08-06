import Swal from "sweetalert2";

interface ErrorObject {
  msg: string;
}

export const errorModal = (text: string | ErrorObject[] | string[]) => {
  let errorMessage: string;

  if (Array.isArray(text)) {
    if (typeof text[0] === 'string') {
      errorMessage = (text as string[]).join('<br>'); 
    } else {
      errorMessage = (text as ErrorObject[]).map(obj => obj.msg).join('<br>'); 
    }
  } else {
    errorMessage = text;
  }

  Swal.fire({
    icon: "error",
    title: "Oops...",
    html: errorMessage, 
    background: '#0e0e0e',
    color: '#fff',
    didOpen: () => {
      const popup = Swal.getPopup();
      if (popup) {
        popup.style.backgroundColor = '#0e0e0e';
        popup.style.color = '#fff';
      }
    },
  });
};
