<?= $this->extend('plantilla/layout') ?>

<?= $this->section('titulo') ?>
    <?= $pagina ?> | <?= session('institucion')['nombre'] ?>
<?= $this->endSection() ?>

<?= $this->section('css') ?>

<?= $this->endSection() ?>

<?= $this->section('contenido') ?>
        <!-- Page Content Wrapper -->
        <aside class="content-wrapper sidebarLeft">

            <!-- Page Content -->
            <div class="content container full-width"> 

                <div class="row">

                    <div class="col-sm-12 col-lg-12">
                        <div class="panel panel-white" style="display: flex;">
                            <img style="margin-left: auto;margin-right: auto;" src="<?= base_url() ?>/uploads/logo/banner.jpg" class="img-thumbnail">
                        </div>
                    </div>
                </div>
            </div>
            <!-- End Page Content -->
        </aside>
        <!-- End Page Content Wrapper -->

<?= $this->endSection() ?>
<?= $this->section('script') ?>
<script src="<?= base_url() ?>/static/curo/js/d3/d3.min.js"></script>   

<script type="text/javascript">
    //Toastr Notification
    toastr.success("Hola, <?= session('usuario')['nombre'] ?>.", "<?= session('institucion')['nombre'] ?>");
    //End Toastr Notification
</script>
<?= $this->endSection() ?>