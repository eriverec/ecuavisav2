import axios from "@axios";
import { defineStore } from "pinia";

export const useCategoriasListStore = defineStore("CategoriasListStore", {
  actions: {
    fetchCategorias() {
      return axios.get(
        // "https://estadisticas.ecuavisa.com/sites/gestor/Tools/Intereses/datareader.php"
        "https://services.ecuavisa.com/Intereses/datareader.php"
      );
    },

    sendCategorias(dato) {
      return new Promise((resolve, reject) => {
        let body = JSON.stringify(dato);

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://send-category.vercel.app/send",
          headers: {
            "Content-Type": "application/json",
          },
          data: body,
        };
        axios
          .request(config)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
  },
});
