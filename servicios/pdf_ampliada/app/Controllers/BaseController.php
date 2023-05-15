<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\HTTP\CLIRequest;
use CodeIgniter\HTTP\IncomingRequest;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

/**
 * Class BaseController
 *
 * BaseController provides a convenient place for loading components
 * and performing functions that are needed by all your controllers.
 * Extend this class in any new controllers:
 *     class Home extends BaseController
 *
 * For security be sure to declare any new methods as protected or private.
 */
abstract class BaseController extends Controller
{
    /**
     * Instance of the main Request object.
     *
     * @var CLIRequest|IncomingRequest
     */
    protected $request;

    /**
     * An array of helpers to be loaded automatically upon
     * class instantiation. These helpers will be available
     * to all other controllers that extend BaseController.
     *
     * @var array
     */
    protected $helpers = [];


    public $obtener_permisos;

    /**
     * Constructor.
     */
    public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger)
    {
        // Do Not Edit This Line
        parent::initController($request, $response, $logger);
        helper('login');
        if(session('usuario')){
            $this->obtener_permisos = listarDetPag(session('usuario')['idrol'],model("Accesopaginas"), $this);
        }
        // Preload any models, libraries, etc, here.
        // E.g.: $this->session = \Config\Services::session();
    }


    public function btnsListarG($urlPagina, $controller){
        $permisos = esConsedido($this->obtener_permisos, $urlPagina, $controller);
        $editar = false;
        $eliminar = false;
        foreach ($permisos as $key => $value) {
            if($key == 'editar' && $value == '1'){
                $editar = true;
            }
            if($key == 'eliminar' && $value == '1'){
                $eliminar = true;
            }
        }
        if($editar && $eliminar){
            return ['all'];
        }

        if($editar && !$eliminar){
            return ['editar'];
        }

        if(!$editar && $eliminar){
            return ['elim'];
        }
        return [];
    }
}
