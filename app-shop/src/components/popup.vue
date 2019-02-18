<template>
	<div>
		<!--<mt-popup v-model="popupParameter" position="bottom" class="mint-popup-4">-->
			<mt-popup  >
			<div class="service-popup">
				<div>服务说明</div>
		      	<div>
			      	<div>
			      		<p>全国联保</p>
			      		<p>全国联保</p>
			      	</div>
			      	<div>
			      		<p>行货正品</p>
			      		<p>行货正品</p>
			      	</div>
			      	<div>
			      		<p>顺丰包邮</p>
			      		<p>顺丰包邮</p>
			      	</div>
			      	<div>
			      		<p>带发票</p>
			      		<p>带发票</p>
			      	</div>
		      	</div>
		      	<button>完成</button>
			</div>
	    </mt-popup>
	</div>
</template>

<script>
export default {
	name :'popup'
}
</script>

<style scoped>
	.service-popup,.mint-popup{
		width: 100%;
	}
</style>