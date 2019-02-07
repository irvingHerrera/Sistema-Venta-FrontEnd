<template>

    <v-layout align-start>
        <v-flex>
                  <v-toolbar flat color="white">
        <v-toolbar-title>Consulta Ventas</v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        Desde:
        <v-text-field type="date" v-if="verNuevo===0" 
        class="text-xs-center" v-model="fechaInicio"></v-text-field>
        Hasta:
        <v-text-field type="date" v-if="verNuevo===0" 
        class="text-xs-center" v-model="fechaFin"></v-text-field>
        <v-btn v-if="verNuevo===0" @click="listar" color="primary" dark class="mb-2">Buscar</v-btn>
        <v-dialog v-model="comprobanteModal" max-width="1000px">
            <v-card>
                <v-card-text>
                    <v-btn @click="crearPDF()">
                        <v-icon>print</v-icon>
                    </v-btn>
                    <div id="factura">
                        <header>
                            <div id="logo">
                                <img src="data:image/png;base64,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" id="imagen">
                            </div>
                            <div id="datos">
                                <p id="encabezado">
                                    <b>IncanatoIT</b><br>José Gálvez 1368, Chongoyape - Chiclayo, Perú<br>Telefono:(+51)931742904<br>Email:jcarlos.ad7@gmail.com
                                </p>
                            </div>
                            <div id="fact">
                                <p>{{tipoComprobante}}<br>
                                {{serieComprobante}}-{{numComprobante}}<br>
                                {{fechaHora}}</p>
                            </div>
                        </header>
                        <br>
                        <section>
                            <div>
                                <table id="facliente">
                                    <tbody>
                                        <tr>
                                            <td id="cliente">
                                                <strong>Sr(a). {{cliente}}</strong><br>
                                                <strong>Documento:</strong> {{numDocumento}}<br>
                                                <strong>Dirección:</strong> {{direccion}}<br>
                                                <strong>Teléfono:</strong> {{telefono}}<br>
                                                <strong>Email:</strong> {{email}}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                        <br>
                        <section>
                            <div>
                                <table id="facarticulo">
                                    <thead>
                                        <tr id="fa">
                                            <th>CANT</th>
                                            <th>DESCRIPCION</th>
                                            <th>PRECIO UNIT</th>
                                            <th>DESC.</th>
                                            <th>PRECIO TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="det in detalles" :key="det.idDetalleVenta">
                                            <td style="text-align:center;">{{det.cantidad}}</td>
                                            <td>{{det.articulo}}</td>
                                            <td style="text-align:right;">{{det.precio.toFixed(2)}}</td>
                                            <td style="text-align:right;">{{det.descuento.toFixed(2)}}</td>
                                            <td style="text-align:right;">{{(det.cantidad * det.precio-det.descuento).toFixed(2)}}</td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th style="text-align:right;">SUBTOTAL</th>
                                            <th style="text-align:right;">$ {{totalParcial=(total-totalImpuesto).toFixed(2)}}</th>
                                        </tr>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th style="text-align:right;">IVA ({{impuesto}})%</th>
                                            <th style="text-align:right;">$ {{totalImpuesto=((total*impuesto)/(100+impuesto)).toFixed(2)}}</th>
                                        </tr>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th style="text-align:right;">TOTAL</th>
                                            <th style="text-align:right;">$ {{total=(calcularTotal).toFixed(2)}}</th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </section>
                        <br>
                        <br>
                        <footer>
                            <div id="gracias">
                                <p><b>Gracias por su compra!</b></p>
                            </div>
                        </footer>
                    </div>
                    <v-btn @click="ocultarComproante()" color="blue darkn-1" flat>Cancelar</v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="ventas"
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
                <v-icon
                small
                class="mr-2"
                @click="mostrarComprobante(props.item)"
                >
                print
                </v-icon>
          </td>
          <td>{{ props.item.usuario }}</td>
          <td>{{ props.item.cliente }}</td>
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
                  <v-select v-model="idCliente"
                    :items="clientes" label="Cliente">
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
                        <td>{{ props.item.articulo }}</td>
                        <td><v-text-field type="number" v-model="props.item.cantidad"></v-text-field></td>
                        <td><v-text-field type="number" v-model="props.item.precio"></v-text-field></td>
                        <td><v-text-field type="number" v-model="props.item.descuento"></v-text-field></td>
                        <td>$ {{ props.item.cantidad * props.item.precio - props.item.descuento }}</td>
                        
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
                <v-btn v-if="verDet==0" @click="guardar" color="success">Guardar</v-btn>
            </v-flex>

          </v-layout>
      </v-container>
        </v-flex>
    </v-layout>
    
</template>

<script>
import axios from 'axios';
import jsPDF from 'jspdf';
import html2Canvas from 'html2canvas';

export default {
    data() {
        return {
            ventas:[],
            dialog: false,
            headers: [
                { text: 'Opciones', value: 'opciones' },
                { text: 'Usuario', value: 'usuario', sortable: false  },
                { text: 'Cliente', value: 'cliente', sortable: false  },
                { text: 'Tipo de Compobante', value: 'tipoComprobante', sortable: true  },
                { text: 'Serie de Comprobante', value: 'serieComprobante', sortable: true },
                { text: 'Número Comprobante', value: 'numComprobante', sortable: true },
                { text: 'Fecha', value: 'fechaHora', sortable: false },
                { text: 'Impuesto', value: 'impuesto', sortable: false },
                { text: 'Total', value: 'total', sortable: false },
                { text: 'Estado', value: 'estado', sortable: false },
            ],
            cabeceraDetalle: [
                { text: 'Articulo', value: 'articulo', sortable: false  },
                { text: 'Cantidad', value: 'cantidad', sortable: false  },
                { text: 'Precio', value: 'precio', sortable: false  },
                { text: 'Descuento', value: 'descuento', sortable: false  },
                { text: 'SubTotal', value: 'subtotal', sortable: false },

            ],
            detalles: [
            ],
            search: '',
            id: '',
            idCliente: '',
            clientes: [],
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
            verDet: 0,
            nombre: '',
            valida: 0,
            validaMensaje: [],
            adModal: 0,
            adAccion: 0,
            adNombre: '',
            adId: '',
            comprobanteModal: 0,
            cliente: '',
            fechaHora: '',
            direccion: '',
            telefono: '',
            email: '',
            numDocumento: '',
            fechaInicio: '',
            fechaFin: ''
        }
    },
        computed: {
        calcularTotal: function () {
            var resultado = 0;

            for(var i=0; i<this.detalles.length;i++) { 
                resultado = resultado + (this.detalles[i].precio*this.detalles[i].cantidad - this.detalles[i].descuento);
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
        crearPDF() {

            var quotes = document.getElementById('factura');

            html2Canvas(quotes).then(function(canvas) {
                var imgData = canvas.toDataURL('img/png');
                var imgWidth = 210;
                //var pageHeight = 295;
                var imgHeight = canvas.height * imgWidth / canvas.width;
                //var heighLeft = imgHeight;
                var doc = new jsPDF('p', 'mm', 'a4');
                var position = 0;

                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                doc.save('comprobante.pdf');
            })

        },
        mostrarComprobante(item) {
            this.limpiar();
            this.tipoComprobante = item.tipoComprobante;
            this.serieComprobante = item.serieComprobante;
            this.numComprobante = item.numComprobante;
            this.cliente = item.cliente;
            this.numDocumento = item.numDocumento;
            this.direccion = item.Direccion;
            this.telefono = item.telefono;
            this.email = item.email;
            this.fechaHora = item.fechaHora;
            this.impuesto = item.impuesto;
            this.listarDetalles(item.idVenta);
            this.comprobanteModal = 1;
        },
        ocultarComproante() {
            this.comprobanteModal = 0;
            this.limpiar();
        },
        /* eslint-disable */
        mostrarNuevo() {
            this.verNuevo = 1;
        },
        ocultarNuevo() {
            this.verNuevo = 0;
            this.limpiar();
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
                    precio: data['precioVenta'],
                    descuento: 0
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

        listar() {
            let me = this;
            let header={'Authorization': 'Bearer ' + this.$store.state.token};
            let configuracion = {headers: header};
            let url = '';
            if ( !me.fechaInicio || !me.fechaFin ) {
                 url = 'api/Venta/Listar';               
            } else {
                url = 'api/Venta/ConsultaFecha/'+me.fechaInicio+'/'+me.fechaFin;
            }
            axios.get(url, configuracion)
            .then(function (resp) {
                me.ventas = resp.data;
            }).catch( function (error) {
                console.log(error);
            }) 
        }, 
        listarDetalles(id) {
            let me = this;
            let header={'Authorization': 'Bearer ' + this.$store.state.token};
            let configuracion = {headers: header};
            axios.get('api/Venta/ListarDetalles/'+id, configuracion)
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
            this.idCliente = item.idCliente;
            this.impuesto = item.impuesto;
            this.listarDetalles(item.idVenta);
            this.verNuevo = 1;
            this.verDet = 1;
        },
        select() {
            let me = this;
            let clientesArray = [];
            let header={'Authorization': 'Bearer ' + this.$store.state.token};
            let configuracion = {headers: header};
            axios.get('api/Persona/SelectCliente', configuracion)
            .then(function (resp) {
                clientesArray = resp.data;
                clientesArray.map(function(clie) {
                    me.clientes.push({text: clie.nombre, value: clie.idPersona});
                });
                console.log(resp);
            }).catch( function (error) {
                console.log(error);
            }) 
        }, 
        limpiar() {
            this.id = '';
            this.idCliente = '';
            this.tipoComprobante = '';
            this.serieComprobante = '';
            this.numComprobante = '';
            this.impuesto = 18;
            this.codigo = '';
            this.detalles = [];
            this.total = 0;
            this.totalImpuesto = 0;
            this.totalParcial = 0;
            this.verDet = 0;
        },
        activarDesactivarMostrar( accion, item ) {

            this.adModal = 1;
            this.adNombre = item.numComprobante;
            this.adId = item.idVenta;

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
    }
}
</script>

<style>

#factura {
            padding: 20px;
            font-family: Arial, sans-serif;
            font-size: 16px ;
        }

        #logo {
            float: left;
            margin-left: 2%;
            margin-right: 2%;
        }
        #imagen {
            width: 100px;
        }

        #fact {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
        }   

        #datos {
            float: left;
            margin-top: 0%;
            margin-left: 2%;
            margin-right: 2%;
            /*text-align: justify;*/
        }

        #encabezado {
            text-align: center;
            margin-left: 10px;
            margin-right: 10px;
            font-size: 16px;
        }

        section {
            clear: left;
        }

        #cliente {
            text-align: left;
        }

        #facliente {
            width: 40%;
            border-collapse: collapse;
            border-spacing: 0;
            margin-bottom: 15px;
        }

        #fa {
            color: #FFFFFF;
            font-size: 14px;
        }

        #facarticulo {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            padding: 20px;
            margin-bottom: 15px;
        }

        #facarticulo thead {
            padding: 20px;
            background: #2183E3;
            text-align: center;
            border-bottom: 1px solid #FFFFFF;
        }

        #gracias {
            text-align: center;
        }

</style>