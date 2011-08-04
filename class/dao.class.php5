<?php
class dao {
	private $connect=null;

	function __construct() {
		if (!$this->connect) {
			/* connection a une base mysql en local */
			$this->connect = new Mysqli("localhost","root","stellina","electronq001","3306");
		}
		
		return $this->connect;
	}
	
	public function query($query) {
		$dataSet=$this->connect->query($query);

		if (!is_null($dataSet)) {
			$totalRows = mysqli_num_rows($dataSet);
		} else {
			$totalRows = 0;
		}

		for ( $i = 0; $i < $totalRows; ++$i ) {
			$row = $dataSet->fetch_assoc();
			$result[$i] = $row;
		}
		/* Libération des résultats */
		if ($dataSet != null) {
			$dataSet->close() ;
		}

		return $result ;
	}

	public function insert($query) {
		$this->connect->query($query);
		if (mysqli_error($this->connect))
			throw new Exception("Query exception:\n" .
					mysqli_error($this->connect)) ;
		return mysqli_insert_id($this->connect);
	}

    public function liste_champs($nomtable)
    {
        if($nomtable) {
            $res=mysql_query("SHOW FIELDS FROM `".$nomtable."`",$this->connect);
            $i=0;
            while($row=@mysql_fetch_array($res)) {
                $champs[$i]=$row[0];
                $i++;
            }
        }
        return $champs;
    }

	
	public function getGalleryInfo($gallery) {
		$query='SELECT
				* 
			FROM 
				gallery 
			WHERE
				gallery.dir="'.$gallery.'"';

		return $this->query($query);
	}

	public function getImageData($gallery,$pic=false) {
		if ($pic) 
			$picQuery=" AND picture_id=".$pic;
		else
			$picQuery="";



		$query='SELECT
				picture_id,
				caption,
				file,
				dir
			FROM 
				v_gallery_picture
			WHERE
				dir="'.$gallery.'"'.$picQuery.'
			AND	dpublication IS NOT NULL
			ORDER BY picture_id';

		return $this->query($query);
	}

	public function getImageDetails($pic) {
		if ($pic) 
			$picQuery=" AND picture_id=".$pic;
		else
			$picQuery="";



		$query='SELECT
				picture_id,
				caption,
				file,
				dir
			FROM 
				v_gallery_picture
			WHERE
				picture_id='.$pic;

		return $this->query($query);
	}


	public function getComments($pid,$last=0) {
		return $this->query(
	"SELECT
		user.pseudo,
		user.uid,
		comments.date,
		comments.msg
	FROM
		comments
	INNER JOIN
		user
	WHERE
		comments.uid=user.uid
		AND picture_id=".$pid."
		AND comments.date > ".$last."
	ORDER BY
		date asc");
	}

	public function pictureOfTheDay() {
		$query="SELECT
				COUNT(*) AS cpt
			FROM
				picture
			WHERE
				dpublication >= UNIX_TIMESTAMP(FROM_UNIXTIME(UNIX_TIMESTAMP(),'%Y-%d-%m'))";
		$count=$this->query($query);
		if ($count[0]['cpt']==0) {
			return $this->nextPictureOfTheDay();
		}

		$query="SELECT
			picture_id,dir,file
		FROM
			v_gallery_picture
		ORDER BY 
			dpublication DESC
		LIMIT 1";
		$lastPic=$this->query($query);
		return $lastPic[0];

	}

	public function nextPictureOfTheDay() {
		$query="SELECT
				picture_id,dir,file
			FROM
				v_gallery_picture
			WHERE
				dpublication IS NULL
			ORDER BY 
				picture_id ASC
			LIMIT 1";
echo $query;
		$nextPic=$this->query($query);
		if (isset($nextPic[0]['picture_id'])) {
			$query="UPDATE
					picture
				SET
					dpublication=UNIX_TIMESTAMP(FROM_UNIXTIME(UNIX_TIMESTAMP(),'%Y-%d-%m'))
				WHERE
					picture_id=".$nextPic[0]['picture_id'];
			$this->insert($query);
			return $nextPic[0];
		}
		return false;
	}


}
/*!50001 DROP TABLE `v_gallery_picture`*/;
/*!50001 DROP VIEW IF EXISTS `v_gallery_picture`*/;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_gallery_picture` AS 
select `p`.`picture_id` AS `picture_id`,
`p`.`file` AS `file`,
`p`.`caption` AS `caption`,
`p`.`dpublication` AS `dpublication`,
`g`.`name` AS `gallery_name`,
`g`.`dir` AS `dir`
from (
`gallery` `g` join `picture` `p`

) where (
`p`.`gallery_id` = `g`.`gallery_id`
) */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

?>
