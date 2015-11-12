<?php

header('Content-Type: application/json');

class Response {

	public $sent;

	public $from;
	public $message;
	public $name;

	private $mail;

	/**
	 * Response constructor.
	 * @param $get {array}
	 * @param $mail {PHPMailer}
	 * @internal param bool $sent
	 */
	public function __construct($get, $mail)
	{
		$this->from = $get['from'];
		$this->message = $get['message'];
		$this->name = $get['name'];

		$this->mail = $mail;
	}

	/**
	 * @param mixed $sent
	 */
	public function setSent($sent)
	{
		$this->sent = $sent;
	}

	public function toJSON()
	{
		return json_encode($this);
	}

}

require '../PHPMailer/PHPMailerAutoload.php';

$mail = new PHPMailer;

$mail->CharSet = 'UTF-8';

$mail->isSMTP();
$mail->Host = 'box729.bluehost.com';
$mail->SMTPAuth = true;
$mail->Username = 'mailman@letsmowe.com';
$mail->Password = '64op3gZxONGO';
$mail->SMTPSecure = 'ssl';
$mail->Port = 465;

$mail->setFrom('mailman@letsmowe.com', 'La Lolla - MailMan');
$mail->addAddress($_GET['from'], $_GET['name']);

$mail->isHTML(true);
$mail->Subject = 'Requisição de contato - La Lolla';
$mail->Body = $_GET['message'];
$mail->AltBody = $_GET['message'];

$response = new Response($_GET, $mail);

if(!$mail->send()) {
	$response->setSent(false);
} else {
	$response->setSent(true);
}

print_r($response->toJSON());

?>