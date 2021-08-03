<script lang="ts">
</script>

<div class="px">
	<div class="px__body">
		<div class="px__body__cut"></div>
		<div class="px__body__speaker"></div>
		<div class="px__body__sensor"></div>

		<div class="px__body__mute"></div>
		<div class="px__body__up"></div>
		<div class="px__body__down"></div>
		<div class="px__body__right"></div>
	</div>

	<div class="px__screen">
		<div class="px__screen__">
			<div class="px__screen__frame">
				<slot />
			</div>
		</div>
	</div>
</div>

<style>
	.px {
		position: relative;
		padding: 6% 7%;
	}

	.px__body {
		position: absolute;
		top: 0;
		right: 1%;
		bottom: 0;
		left: 1%;
		background: linear-gradient(to top, #e5e5e5 0%, #f7f7f9 10%, #eeeef0 90%);
		border-radius: 14%/7%;
		box-shadow: inset 0 0 3px 1px #000;
	}

	.px__body:before {
		content: '';
		position: absolute;
		top: 0.7%;
		right: 1.4%;
		bottom: 0.7%;
		left: 1.4%;
		background-color: #000;
		border-radius: 13%/7%;
		box-shadow: 0 0 3px #000;
	}

	.px__body:after {
		content: '';
		position: absolute;
		top: 1%;
		right: 2.3%;
		bottom: 1%;
		left: 2.3%;
		background-color: #000;
		box-shadow: inset 0 0 10px 2px #fff;
		border-radius: 13%/6.5%;
	}

	.px__body__cut {
		position: absolute;
		z-index: 2;
		top: 3%;
		left: 50%;
		width: 50%;
		height: 3.5%;
		background-color: #000;
		border-radius: 0 0 10% 10%/80%;
		transform: translate3d(-50%, 0, 0);
	}

	.px__body__speaker,
	.px__body__sensor {
		position: absolute;
		z-index: 2;
		background-color: #222;
		transform: translate(-50%, -50%);
	}

	.px__body__speaker {
		top: 4%;
		left: 50%;
		width: 12%;
		height: 0.8%;
		border-radius: 5px;
	}

	.px__body__sensor {
		top: 4%;
		left: 61%;
		width: 2.2%;
		height: 1.1%;
		border-radius: 50%;
		background-color: #2a4a73;
		box-shadow: inset 0 0 2px 1px #000;
	}

	.px__body__mute,
	.px__body__up,
	.px__body__down,
	.px__body__right {
		position: absolute;
		background-color: #b5b8ba;
		box-shadow: inset 0 5px 5px -3px rgba(0, 0, 0, 0.5), inset 0 -5px 5px -3px rgba(0, 0, 0, 0.5);
		transform: translate(0, -50%);
	}

	.px__body__mute {
		top: 14.7%;
		left: -0.7%;
		width: 0.7%;
		height: 4%;
		border-radius: 1px 0 0 1px;
	}

	.px__body__up,
	.px__body__down {
		left: -1%;
		width: 1%;
		height: 7.5%;
		border-radius: 2px 0 0 2px;
	}

	.px__body__up {
		top: 25%;
	}

	.px__body__down {
		top: 34%;
	}

	.px__body__right {
		top: 25%;
		right: -1%;
		width: 1%;
		height: 7.5%;
		border-radius: 0 2px 2px 0;
	}

	.px__screen {
		position: relative;
		z-index: 1;
	}

	.px__screen__ {
		position: relative;
		padding-bottom: 218%;
		background-color: #888;
		border-radius: 10%/5%;
		box-shadow: 0 0 10px #000;
	}

	.px__screen__frame {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		overflow: hidden;
		border-radius: inherit;
		background-size: cover;
		background-position: center center;
	}
</style>
