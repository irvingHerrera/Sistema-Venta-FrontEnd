import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Categoria from './components/Categoria.vue';
import Articulo from './components/Articulo.vue';
import Rol from './components/Rol.vue';
import Usuario from './components/Usuario.vue';
import Cliente from './components/Cliente.vue';

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/categorias',
            name: 'categorias',
            component: Categoria
        },
        {
            path: '/articulos',
            name: 'articulos',
            component: Articulo
        },
        {
            path: '/roles',
            name: 'rol',
            component: Rol
        },
        {
            path: '/usuarios',
            name: 'usuario',
            component: Usuario
        },
        {
            path: '/clientes',
            name: 'cliente',
            component: Cliente
        },
    ]
})