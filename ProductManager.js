import { promises as fs } from "fs";

export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {
        try {
            const data = await this.readData();
            const objExist = this.productExists(product, data);

            if (objExist) {
                throw new Error("Código de producto existente, intente otro");
            }

            this.validateProductFields(product);

            let id = data.length === 0 ? 1 : data[data.length - 1].id + 1;
            const newProduct = { ...product, id };
            data.push(newProduct);

            await this.writeData(data);
            console.log(`Agregaste el producto con id: ${newProduct.id} exitosamente`);
        } catch (error) {
            console.error(error.message);
        }
    }

    async getProducts() {
        try {
            const data = await this.readData();
            return data;
        } catch (error) {
            console.error(error.message);
        }
    }

    async getById(id) {
        try {
            const data = await this.readData();
            const product = data.find((product) => product.id === id);

            if (product) {
                return product;
            } else {
                console.log("No se encontró el producto");
            }
        } catch (error) {
            console.error(error.message);
        }
    }
    async updateProduct(id, entry, value) {
        try {
            const data = await this.readData();
            const index = data.findIndex((product) => product.id === id);

            if (index === -1) {
                throw new Error("Producto no encontrado");
            }

            if (data[index][entry] === undefined) {
                throw new Error("El campo especificado no existe en el producto");
            }

            data[index][entry] = value;

            await this.writeData(data);
            console.log('Producto actualizado exitosamente:', data[index]);
        } catch (error) {
            console.error(error.message);
        }
    }


    async deleteProduct(id) {
        try {
            const data = await this.readData();
            const productToDelete = data.find((product) => product.id === id);

            if (!productToDelete) {
                throw new Error("Producto no encontrado");
            }

            const newData = data.filter((product) => product.id !== id);
            await this.writeData(newData);
            console.log(`El producto con id ${id} ha sido eliminado exitosamente`);
        } catch (error) {
            console.error(error.message);
        }
    }


    async readData() {
        const read = await fs.readFile(this.path, "utf8");
        return JSON.parse(read);
    }

    async writeData(data) {
        await fs.writeFile(this.path, JSON.stringify(data, null, 2), "utf-8");
    }

    productExists(product, data) {
        return data.some((existingProduct) => existingProduct.code === product.code);
    }

    validateProductFields(product) {
        const requiredFields = ["code", "name", "price"];
        for (const field of requiredFields) {
            if (!product[field]) {
                throw new Error("Todos los campos del producto deben estar completos para poder ser ingresado");
            }
        }
    }
}

const  products = new ProductManager('./data.json')