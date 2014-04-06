<?php
/**
 * @author Erik Boss
 * @copyright Copyright (C) 2014 Erik Boss <erik@erikboss.nl>
 */

$appRoot = dirname(__DIR__);
Yii::setAlias('@neiorest', realpath($appRoot));

$config = [
    'id' => 'neiorest',
    'basePath' => $appRoot,
    'extensions' => require(__DIR__ . '/../vendor/yiisoft/extensions.php'),

    'controllerNamespace' => 'neiorest\controllers',

    'preload' => ['log'],
    'components' => [
        'urlManager' => [
            //'enablePrettyUrl' => true,
            'showScriptName' => false,
            //'rules' => [
                //'<controller:\w+>/<action:\w+>' => '<controller>/<action>',
                //'<module:\w+>/<controller:\w+>/<action:\w+>' => '<module>/<controller>/<action>',
            //],
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'db' => [
            'class' => 'yii\db\Connection',
            'dsn' => 'sqlite:' . realpath($appRoot) . '/data/sqlite.db',
            //'charset' => 'utf8',
        ],
    ],
    'params' => [],
];

if (YII_ENV_DEV) {
    // configuration adjustments for 'dev' environment
    $config['preload'][] = 'debug';
    $config['modules']['debug'] = 'yii\debug\Module';
}

return $config;
