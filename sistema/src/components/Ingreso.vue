<template>

    <v-layout align-start>
        <v-flex>
                  <v-toolbar flat color="white">
        <v-toolbar-title>Ingresos</v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-text-field v-if="verNuevo===0" class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
         <v-btn v-if="verNuevo===0" @click="mostrarNuevo" color="primary" dark class="mb-2">Nuevo</v-btn>
         <v-dialog v-model="verArticulo" max-width="1000px">
             <v-card>
                 <v-card-title>
                     <span class="headline">Seleccione un articulo</span>
                     <v-card-text>

                         <v-container grid-list-md>
                             <v-layout wrap>
                                 <v-flex xs12 sm12 md12 lg12 xl12 >
                                     <v-text-field append-icon="search" 
                                        label="Ingrese articulo a buscar"
                                        @keyup.enter="listarArticulo()"
                                        class="text-xs-center" v-model="texto">

                                        </v-text-field>
                                    <template>
                                        <v-data-table
                                        :headers="cabeceraArticulo"
                                        :items="articulos"
                                        class="elevation-1">
                                        
                                            <template slot="items" slot-scope="props">
                                                    <td class="justify-center layout px-0">
                                                        <v-icon
                                                        small
                                                        class="mr-2"
                                                        @click="agregarDetalle(props.item)"
                                                        >
                                                        add
                                                        </v-icon>
                                                </td>
                                                <td>{{ props.item.nombre }}</td>
                                                <td> {{props.item.categoria}}</td>
                                                <td> {{props.item.descripcion}}</td>
                                                <td> {{props.item.stock}}</td>
                                                <td> {{props.item.precio}}</td>
                                            
                                            </template>
                                            <template slot="no-data">
                                                <h3>No hay articulos para mostrar</h3>
                                            </template>
                                    </v-data-table>
                                    </template>
                                 </v-flex>
                             </v-layout>
                         </v-container>

                     </v-card-text>
                     <v-card-actions>
                         <v-spacer>
                             <v-btn @click="ocultarArticulos()" color="blue darken" flat>
                                 Cancelar
                             </v-btn>
                         </v-spacer>
                     </v-card-actions>
                 </v-card-title>
             </v-card>
         </v-dialog>
        <v-dialog v-model="adModal" max-width="400px">
            <v-card>
                <v-card-title class="headline" v-if="adAccion==1">¿Activar Ingreso?</v-card-title>
                <v-card-title class="headline" v-if="adAccion==2">Anular Ingreso?</v-card-title>
                <v-card-text>
                    Estás a punto de 
                    <span v-if="adAccion==1">Activar</span>
                    <span v-if="adAccion==2">Anular</span>
                    el ingreso {{ adNombre }}
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
                        Anular
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="ingresos"
        :search="search"
        class="elevation-1"
        v-if="verNuevo===0"
      >
        <template slot="items" slot-scope="props">
            <td class="justify-center layout px-0">
                <v-icon
                small
                class="mr-2"
                @click="varDetalles(props.item)"
                >
                tab
                </v-icon>
                <template v-if="props.item.estado == 'Aceptado'">
                    <v-icon
                        small
                        @click="activarDesactivarMostrar(2, props.item)">
                        block
                    </v-icon>
                </template>
                
          </td>
          <td>{{ props.item.usuario }}</td>
          <td>{{ props.item.proveedor }}</td>
          <td>{{ props.item.tipoComprobante }}</td>
          <td>{{ props.item.serieComprobante }}</td>
          <td>{{ props.item.numComprobante }}</td>
          <td>{{ props.item.fechaHora}}</td>
          <td>{{ props.item.impuesto}}</td>
          <td>{{ props.item.total}}</td>
          <td>
              <div v-if=" props.item.estado == 'Aceptado'">
                  <span class="blue--text">Aceptado</span>
              </div>
              <div v-else>
                   <span class="red--text">{{props.item.estado}}</span>
              </div>
          </td>
          
        </template>
        <template slot="no-data">
          <v-btn color="primary" @click="listar">Resetear</v-btn>
        </template>
      </v-data-table>
      <v-container grid-list-sm class="pa-4 white" style="padding-top:15px" v-if="verNuevo">
          <v-layout row wrap>
              <v-flex xs12 sm4 md4 lg4 x14>
                  <v-select v-model="tipoComprobante"
                    :items="comprobantes" label="Tipo Compobante">
                  </v-select>
              </v-flex>
              <v-flex xs12 sm4 md4 lg4 x14>
                  <v-text-field v-model="serieComprobante" label="Serie Comprobante"></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 md4 lg4 x14>
                  <v-text-field v-model="numComprobante" label="Número Comprobante"></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 md4 lg4 x14>
                  <v-select v-model="idProveedor"
                    :items="proveedores" label="Proveedor">
                  </v-select>
              </v-flex>
              <v-flex xs12 sm4 md4 lg4 x14>
                  <v-text-field type="number" 
                                v-model="impuesto" 
                                label="Impuesto">
                  </v-text-field>
              </v-flex>
              <v-flex xs12 sm8 md8 lg8 x18>
                  <v-text-field @keyup.enter="buscarCodigo()" v-model="codigo" 
                                label="Código">
                  </v-text-field>
              </v-flex>
              <v-flex xs12 sm2 md2 lg2 x12>
                  <v-btn @click="mostrarArticulos()" small fab dark color="teal">
                      <v-icon dark>list</v-icon>
                  </v-btn>
              </v-flex>
               <v-flex xs12 sm2 md2 lg2 x12 v-if="errorArticulo">
                  <div class="red--text" v-text="errorArticulo">

                  </div>
              </v-flex>
              <v-flex xs12 sm12 md12 lg12 x112>
                        <v-data-table
                        :headers="cabeceraDetalle"
                        :items="detalles"
                        hide-actions
                        class="elevation-1">
                        <template slot="items" slot-scope="props">
                            <td class="justify-center layout px-0">
                                <v-icon
                                small
                                class="mr-2"
                                @click="eliminarDetalle(detalles, props.item)"
                                >
                                delete
                                </v-icon>
                        </td>
                        <td>{{ props.item.articulo }}</td>
                        <td><v-text-field type="name" v-model="props.item.cantidad"></v-text-field></td>
                        <td><v-text-field type="name" v-model="props.item.precio"></v-text-field></td>
                        <td>$ {{ props.item.cantidad * props.item.precio }}</td>
                        
                        </template>
                        <template slot="no-data">
                            <h3>No hay articulos agregados al detalle</h3>
                        </template>
                    </v-data-table>
                    <v-flex class="text-xs-right">
                        <strong>Total Parcial:</strong> $ {{totalParcial = (total - totalImpuesto).toFixed(2)}}
                    </v-flex>
                    <v-flex class="text-xs-right">
                        <strong>Total Impuesto:</strong> $ {{totalImpuesto= ((total*impuesto)/(100+impuesto)).toFixed(2)}}
                    </v-flex>
                    <v-flex class="text-xs-right">
                        <strong>Total Neto:</strong> $ {{total=(calcularTotal).toFixed(2)}}
                    </v-flex>
              </v-flex>

            <v-flex xs12 sm12 md12 lg12 x112>
                <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
            </v-flex>
            
            <v-flex xs12 sm12 md12 lg12 x112>
                <v-btn @click="ocultarNuevo" color="blue darken-1" flat>Cancelar</v-btn>
                <v-btn v-if="verDef==0" @click="guardar" color="success">Guardar</v-btn>
            </v-flex>

          </v-layout>
      </v-container>
        </v-flex>
    </v-layout>
    
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            ingresos:[],
            dialog: false,
            headers: [
                { text: 'Opciones', value: 'opciones' },
                { text: 'Usuario', value: 'usuario', sortable: false  },
                { text: 'Proveedor', value: 'proveedor', sortable: false  },
                { text: 'Tipo de Compobante', value: 'tipoComprobante', sortable: true  },
                { text: 'Serie de Comprobante', value: 'serieComprobante', sortable: true },
                { text: 'Número Comprobante', value: 'numComprobante', sortable: true },
                { text: 'Fecha', value: 'fechaHora', sortable: false },
                { text: 'Impuesto', value: 'impuesto', sortable: false },
                { text: 'Total', value: 'total', sortable: false },
                { text: 'Estado', value: 'estado', sortable: false },
            ],
            cabeceraDetalle: [
                { text: 'Borrar', value: 'borrar', sortable: false },
                { text: 'Articulo', value: 'articulo', sortable: false  },
                { text: 'Cantidad', value: 'cantidad', sortable: false  },
                { text: 'Precio', value: 'precio', sortable: false  },
                { text: 'SubTotal', value: 'subtotal', sortable: false },

            ],
            detalles: [
            ],
            search: '',
            id: '',
            idProveedor: '',
            proveedores: [],
            comprobantes: [
                'FACTURA', 'BOLETA', 'TICKET', 'GUIA'
            ],
            serieComprobante: '',
            numComprobante: '',
            tipoComprobante: '',
            impuesto: 18,
            codigo: '',
            verNuevo: 0,
            errorArticulo: null,
            totalParcial: 0,
            totalImpuesto: 0,
            total: 0,
            cabeceraArticulo: [
                {text: 'Seleccionar', value: 'Seleccionar', soryable:false},
                {text: 'Articulo', value: 'articulo'},
                {text: 'Categoria', value: 'categoria'},
                {text: 'Descripción', value: 'descripcion',soryable:false},
                {text: 'Stock', value: 'stock', soryable:false},
                {text: 'Precio Venta', value: 'precioVenta', soryable:false},
            ],
            articulos: [],
            texto: '',
            verArticulo: 0,
            varDet: 0,
            nombre: '',
            valida: 0,
            validaMensaje: [],
            adModal: 0,
            adAccion: 0,
            adNombre: '',
            adId: '',
        }
    },
        computed: {
        calcularTotal() {
            var resultado = 0;

            for(var i=0; i<this.detalles.length;i++) { 
                resultado = resultado + (this.detalles[i].precio*this.detalles[i].cantidad);
            }

            return resultado;
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

        mostrarNuevo() {
            this.verNuevo = 1;
        },
        ocultarNuevo() {
            this.verNuevo = 0;
            this.limpiar();
        },
        buscarCodigo() {
            let me = this;
            me.errorArticulo = null;
            let header={'Authorization': 'Bearer ' + this.$store.state.token};
            let configuracion = {headers: header};
            axios.get('api/Articulo/BuscarCodigoIngreso/'+this.codigo, configuracion)
            .then(function (resp) {
                me.agregarDetalle(resp.data);
            }).catch( function (error) {
                console.log(error);
                me.errorArticulo = 'No existe el articulo';
            }) 
        }, 
        listarArticulo() {
            let me = this;
            let header={'Authorization': 'Bearer ' + this.$store.state.token};
            let configuracion = {headers: header};
            axios.get('api/Articulo/ListarIngreso/'+ me.texto, configuracion)
            .then(function (resp) {
                me.articulos = resp.data;
            }).catch( function (error) {
                console.log(error);
            }) 
        },
        mostrarArticulos() {
            this.verArticulo = 1;
        },
        ocultarArticulos() {
            this.verArticulo = 0;
        },
        agregarDetalle(data = []) {
            this.errorArticulo = null;
            if( this.encuentra(data['idArticulo']) ) {
                this.errorArticulo = 'El articulo ya ha sido agregado';
            } else {
                this.detalles.push(
                {
                    idArticulo: data['idArticulo'],
                    articulo: data['nombre'],
                    cantidad: 1,
                    precio: 1
                }
            );
            }
        },
        encuentra(id) {
            var sw = 0;

            for(var i=0; i<this.detalles.length;i++) {
                if (this.detalles[i].idArticulo === id) {
                    sw = 1;
                }
            }
            return sw;
        },
        eliminarDetalle(arr, item) {
            var index = arr.indexOf(item);

            if(index !== -1) {
                arr.splice(index, 1);
            }
        },
        listar() {
            let me = this;
            let header={'Authorization': 'Bearer ' + this.$store.state.token};
            let configuracion = {headers: header};
            axios.get('api/Ingreso/Listar', configuracion)
            .then(function (resp) {
                me.ingresos = resp.data;
            }).catch( function (error) {
                console.log(error);
            }) 
        }, 
        listarDetalles(id) {
            let me = this;
            let header={'Authorization': 'Bearer ' + this.$store.state.token};
            let configuracion = {headers: header};
            axios.get('api/Ingreso/ListarDetalles/'+id, configuracion)
            .then(function (resp) {
                me.detalles = resp.data;
            }).catch( function (error) {
                console.log(error);
            }) 
        },
        varDetalles(item) {
            this.limpiar();
            this.tipoComprobante = item.tipoComprobante;
            this.serieComprobante = item.serieComprobante;
            this.numComprobante = item.numComprobante;
            this.idProveedor = item.idProveedor;
            this.impuesto = item.impuesto;
            this.listarDetalles(item.idIngreso);
            this.verNuevo = 1;
            this.varDet = 1;
        },
        select() {
            let me = this;
            let proveedoresArray = [];
            let header={'Authorization': 'Bearer ' + this.$store.state.token};
            let configuracion = {headers: header};
            axios.get('api/Persona/SelectProveedor', configuracion)
            .then(function (resp) {
                proveedoresArray = resp.data;
                proveedoresArray.map(function(pro) {
                    me.proveedores.push({text: pro.nombre, value: pro.idPersona});
                });
                console.log(resp);
            }).catch( function (error) {
                console.log(error);
            }) 
        }, 

        limpiar() {
            this.id = '';
            this.idProveedor = '';
            this.tipoComprobante = '';
            this.serieComprobante = '';
            this.numComprobante = '';
            this.impuesto = 18;
            this.codigo = '';
            this.detalles = [];
            this.total = 0;
            this.totalImpuesto = 0;
            this.totalParcial = 0;
            this.varDet = 0;
        },

        guardar () {

            if( this.validar()) {
                return;
            }

            let promesa = {};
            let me = this;

            let header={'Authorization': 'Bearer ' + this.$store.state.token};
            let configuracion = {headers: header};
            console.log(me.$store.state.usuario);
            // codigo para guardar
            promesa = axios.post('api/Ingreso/Crear', { 
                'idProveedor': me.idProveedor,
                'idUsuario': me.$store.state.usuario.idusuario,
                'tipoComprobante': me.tipoComprobante,
                'serieComprobante': me.serieComprobante,
                'numComprobante': me.numComprobante,
                'impuesto': me.impuesto,
                'total': me.total,
                'detalle': me.detalles
                }, configuracion);
                

            promesa
            .then(function (response) {
                // eslint-disable-next-line
                    console.log("response", response);
                    me.ocultarNuevo()
                    me.listar();
                    me.limpiar();
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

            if( !this.idProveedor ) {
                this.validaMensaje.push('Seleccione un proveedor.');
            }

            if( !this.tipoComprobante ) {
                this.validaMensaje.push('Seleccione un tipo de comprobante.');
            }

            if( !this.numComprobante ) {
                this.validaMensaje.push('Seleccione el impuesto valido.');
            }

            if( this.detalles.length <= 0 ) {
                this.validaMensaje.push('Ingrese al menos un articulo al detalle.');
            }
            
            if( this.validaMensaje.length ) {
                this.valida = 1;
            }

            return this.valida;
        },
        activarDesactivarMostrar( accion, item ) {

            this.adModal = 1;
            this.adNombre = item.numComprobante;
            this.adId = item.idIngreso

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

            let header={'Authorization': 'Bearer ' + this.$store.state.token};
            let configuracion = {headers: header};

            axios
            .put('api/Usuario/Activar/'+this.adId, { }, configuracion)
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

            let header={'Authorization': 'Bearer ' + this.$store.state.token};
            let configuracion = {headers: header};

            axios
            .put('api/Ingreso/Anular/'+this.adId, { }, configuracion)
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
