<?php
use yii\helpers\Html;

use neiorest\assets\AppAsset;

AppAsset::register($this);
?>

<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
</head>
<body>
    <?php $this->beginBody() ?>

    <div class="wrap">

    <div class="container-fluid">
        <?php if (Yii::$app->session->hasFlash('success')):?>
        <div id="flash" class="row">
            <?= Yii::$app->session->getFlash('success') ?>
        </div>
        <?php endif ?>

        <?= $content ?>
    </div>

    </div>

     <footer class="footer">
    <div class="container">
    </div>
    </footer>

    <?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
