<?php 
/**
 * @author Erik Boss <erik@erikboss.nl>
 * @copyright Copyright (C) 2014 Erik Boss
 */

namespace neiorest\models;

use yii\db\ActiveRecord;

class Template extends ActiveRecord {
    public static function tableName()
    {
        return 'template';
    }
}
