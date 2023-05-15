<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title></title>
	<style>
	    @page {
	    	margin-top: 1cm;
	    	margin-left: 1cm;
	    	margin-right: 1cm;
	        size: auto;
	        odd-header-name: MyHeader1;
	        odd-footer-name: MyFooter1;
	    }
	    .content{
	    	padding-top:70px;
	    }
	    .table-reporte { 
            border-collapse: collapse; 
        }
        .table-reporte th { 
            background: #fefefe; 
            color: rgb(0, 0, 0); 
            font-weight: bold; 
        }
        .table-reporte th, .table-reporte td { 
            padding: 10px; 
            border: 1px solid #ccc; 
            text-align: left; 
            font-size: 12px;
        }
        .table-reporte tr:nth-of-type(odd) { 
            background: #eee; 
        }
	</style>
</head>
<body>
    <htmlpageheader name="MyHeader1" class="header" >
    	<?= $this->include('informe/template/header') ?>
    </htmlpageheader>
    <div class="content">
    	<h1><?= $datos["titulo"] ?></h1>
    	<small>
    		<?= $datos["subheadline"] ?>
    	</small>
    	<br>
    	<div style="margin-top:10px;margin-bottom: 10px;">
    	    <img width="50%" class="logo" src="<?= $datos["image"] ?>">
    	</div>
    	<div class="content-2">
    	    <?= $datos["descripcion"] ?>
    	</div>
    </div>
    <pagefooter name="MyFooter1" content-left="{DATE j-m-Y}" content-center="{PAGENO}/{nbpg}" footer-style="font-size: 8pt;" />
    

</body>
</html>