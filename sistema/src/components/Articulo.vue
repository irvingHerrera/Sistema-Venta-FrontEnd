<template>

    <v-layout align-start>
        <v-flex>
                  <v-toolbar flat color="white">
        <v-toolbar-title>Articulos</v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <v-btn slot="activator" color="primary" dark class="mb-2">Nuevo</v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
  
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs6 sm6 md6>
                    <v-text-field v-model="codigo" label="Código"></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <v-select v-model="idCategoria" :items="categorias" lable="Categorías"></v-select>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <v-text-field type="number" v-model="stock" label="Stock"></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <v-text-field type="number" v-model="precioVenta" label="Precio Venta"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="descripcion" label="Descripción"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12 v-show="valida">
                   <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">

                   </div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
  
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" flat @click="guardar">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="adModal" max-width="400px">
            <v-card>
                <v-card-title class="headline" v-if="adAccion==1">¿Activar Articulo?</v-card-title>
                <v-card-title class="headline" v-if="adAccion==2">Desactivar Articulo?</v-card-title>
                <v-card-text>
                    Estás a punto de 
                    <span v-if="adAccion==1">Activar</span>
                    <span v-if="adAccion==2">Desactivar</span>
                    el articulo {{ adNombre }}
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat="flat" @click="activarDesactivarCerrar">
                        Cancelar
                    </v-btn>
                    <v-btn v-if="adAccion==1" color="orange darken-4" flat="flat" @click="activar">
                        Activar
                    </v-btn>
                    <v-btn v-if="adAccion==2" color="orange darken-4" flat="flat" @click="desactivar">
                        Desactivar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="articulos"
        :search="search"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
            <td class="justify-center layout px-0">
                <v-icon
                small
                class="mr-2"
                @click="editItem(props.item)"
                >
                edit
                </v-icon>
                <template v-if="props.item.condicion">
                    <v-icon
                        small
                        @click="activarDesactivarMostrar(2, props.item)">
                        block
                    </v-icon>
                </template>
                <template v-else>
                    <v-icon
                        small
                        @click="activarDesactivarMostrar(1, props.item)">
                        check
                    </v-icon>
                </template>
                
          </td>
          <td>{{ props.item.codigo }}</td>
          <td>{{ props.item.nombre }}</td>
          <td>{{ props.item.categoria }}</td>
          <td>{{ props.item.stock }}</td>
          <td>{{ props.item.precioVenta }}</td>
          <td>{{ props.item.descripcion }}</td>
          <td>
              <div v-if=" props.item.condicion">
                  <span class="blue--text">Activo</span>
              </div>
              <div v-else>
                   <span class="red--text">Inactivo</span>
              </div>
          </td>
          
        </template>
        <template slot="no-data">
          <v-btn color="primary" @click="listar">Resetear</v-btn>
        </template>
      </v-data-table>
        </v-flex>
    </v-layout>
    
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            articulos:[],
            dialog: false,
            headers: [
                { text: 'Opciones', value: 'opciones', sortable: false },
                { text: 'Código', value: 'codigo' },
                { text: 'Nombre', value: 'nombre', sortable: false },
                { text: 'Categoria', value: 'categoria', sortable: false },
                { text: 'Stock', value: 'stock', sortable: false },
                { text: 'Precio Venta', value: 'precioVenta', sortable: false },
                { text: 'Descripción', value: 'descripcion', sortable: false },
                { text: 'Estado', value: 'condicion', sortable: false },
            ],
            search: '',
            editedIndex: -1,
            id: '',
            idCategoria: '',
            categorias: [],
            codigo: '',
            nombre: '',
            stock: 0,
            precioVenta: 0,
            descripcion: '',
            valida: 0,
            validaMensaje: [],
            adModal: 0,
            adAccion: 0,
            adNombre: '',
            adId: '',
        }
    },
        computed: {
        formTitle () {
        return this.editedIndex === -1 ? 'Nueva Articulo' : 'Actualizando Articulo'
        }
    },

    watch: {
        dialog (val) {
        val || this.close()
        }
    },

    created () {
        this.listar();
        this.select();
    },
    methods: {
        /* eslint-disable */
        listar() {
            let me = this;
            axios.get('api/Articulo/Listar')
            .then(function (resp) {
                me.articulos = resp.data;
                console.log(resp);
            }).catch( function (error) {
                console.log(error);
            }) 
        }, 
        select() {
            let me = this;
            let categoriaArray = [];
            axios.get('api/Categorias/Select')
            .then(function (resp) {
                categoriaArray = resp.data;
                categoriaArray.map(function(cat) {
                    me.categorias.push({text: cat.nombre, value: cat.idCategoria});
                });
                console.log(resp);
            }).catch( function (error) {
                console.log(error);
            }) 
        }, 
            editItem (item) {
                this.id = item.idArticulo;
                this.idCategoria = item.idCategoria,
                this.codigo = item.codigo,
                this.nombre = item.nombre;
                this.stock = item.stock;
                this.precioVenta = item.precioVenta;
                this.descripcion = item.descripcion;
                this.editedIndex = 1;
                this.dialog = true
            },

            deleteItem (item) {
                const index = this.desserts.indexOf(item)
                confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
            },

            close () {
                this.dialog = false;
                this.limpiar();
            },

            limpiar() {
                this.id = '';
                this.idCategoria = '';
                this.codigo = '';
                this.nombre = '';
                this.stock = '';
                this.precioVenta = '';
                this.descripcion = '';
                this.deleteItem =  '';
                this.valida = 0;
                this.editedIndex = -1;
            },

            guardar () {

                if( this.validar() === 1 ) {
                    return;
                }

                let promesa = {};
                let me = this;

                if (this.editedIndex > -1) {
                    // codigo para editar
                    
                    promesa = axios.put('api/Articulo/Actualizar', { 
                        'idArticulo': me.id,
                        'idCategoria': me.idCategoria,
                        'codigo': me.codigo,
                        'nombre': me.nombre,
                        'stock': me.stock,
                        'precioVenta': me.precioVenta,
                        'descripcion': me.descripcion
                     });
                } else {
                    // codigo para guardar
                    promesa = axios.post('api/Articulo/Crear', { 
                        'idArticulo': '0',
                        'idCategoria': me.idCategoria,
                        'codigo': me.codigo,
                        'nombre': me.nombre,
                        'stock': me.stock,
                        'precioVenta': me.precioVenta,
                        'descripcion': me.descripcion
                     });
                    
                }

                promesa
                .then(function (response) {
                    // eslint-disable-next-line
                        console.log("response", response);
                        me.close();
                        me.listar();
                })
                // eslint-disable-next-line
                .catch(function (error) {
                    // eslint-disable-next-line
                    console.log(error);
                });
            },
            validar() {

                this.valida = 0;
                this.validaMensaje = [];
                if( this.nombre.length < 3 || this.nombre.length > 50 ) {
                    this.validaMensaje.push('El nombre debe tener mas de 3 caracteres y menos de 50 caracteres.');
                }

                if( !this.idCategoria ) {
                    this.validaMensaje.push('Seleccione una categoría.');
                }

                if( !this.stock || this.stock === 0 ) {
                    this.validaMensaje.push('Ingrese el stock inicial del prodecto.');
                }

                if( !this.precioVenta || this.precioVenta === 0 ) {
                    this.validaMensaje.push('Ingrese el precio de venta del producto.');
                }

                if( this.validaMensaje.length ) {
                    this.valida = 1;
                }

                return this.valida;
            },
            activarDesactivarMostrar( accion, item ) {

                this.adModal = 1;
                this.adNombre = item.nombre;
                this.adId = item.idArticulo

                if ( accion === 1 ) {
                    this.adAccion = 1;
                } else if ( accion === 2 ) {
                    this.adAccion = 2;
                } else  {
                    this.adModal = 0;
                }
            },
            activar () {
                let me = this;
                axios
                .put('api/Articulo/Activar/'+this.adId, { })
                     .then(function (response) {
                    // eslint-disable-next-line
                        console.log("response", response);
                        me.adModal = 0;
                        me.adAccion = 0;
                        me.adNombre = '';
                        me.adId = '';
                        me.listar();
                    })
                    // eslint-disable-next-line
                    .catch(function (error) {
                        // eslint-disable-next-line
                        console.log(error);
                    });
            },
            desactivar() {
                let me = this;
                axios
                .put('api/Articulo/Desactivar/'+this.adId, { })
                     .then(function (response) {
                    // eslint-disable-next-line
                        console.log("response", response);
                        me.adModal = 0;
                        me.adAccion = 0;
                        me.adNombre = '';
                        me.adId = '';
                        me.listar();
                    })
                    // eslint-disable-next-line
                    .catch(function (error) {
                        // eslint-disable-next-line
                        console.log(error);
                    });
            },
            activarDesactivarCerrar() {
                this.adModal = 0;
            }
    }
}
</script>
