<script setup lang="ts">
import {NSelect, NInput,NSlider, NButton, useMessage,NTag} from "naive-ui"
import { ref ,computed,watch, onMounted} from "vue";
import {gptConfigStore, homeStore,useChatStore} from '@/store'
import { mlog,chatSetting } from "@/api";
import { t } from "@/locales";
import { getKnowledge } from '@/api/knowledge'
import { getToken } from "@/store/modules/auth/helper";
import to from "await-to-js";
import { modelList } from '@/api/model'

const emit = defineEmits(['close']);
const chatStore = useChatStore();
const uuid = chatStore.active;

const chatSet = new chatSetting( uuid==null?1002:uuid);

const nGptStore = ref(  chatSet.getGptConfig() );
const message = useMessage()
onMounted(() => { fetchData(),fetchDataGetKnowledge() });


const config = ref([])
const fetchData = async () => {
	try {
		// 发起一个请求
		const [err, result] = await to(modelList('chat'));

		if (err) {
			message.error(err.message)
			config.value = []; // 设置为空数组，避免迭代错误
		} else {
			config.value = result.data;
		}
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};

const fetchDataGetKnowledge = async () => {
	if(getToken()){
		try {
			// 发起一个请求
			const [err, result] = await to(getKnowledge());
			console.log("result===", result.rows)
			if (err) {
				ms.error(err.message)
			} else {
				options.value = result.rows.map((item: any) => ({
					label: item.kname, // 假设后台返回的数据有 'name' 字段
					value: item.id     // 假设每个数据项都有一个唯一的 'id' 字段
				}));

				// 请求成功
				options.value.push({ label: '暂不配置', value: '' });
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}
};

const st= ref({openMore:false });
const voiceList= computed(()=>{
	let rz=[];
	for(let o of "alloy,echo,fable,onyx,nova,shimmer".split(/[ ,]+/ig))rz.push({label:o,value:o})
	return rz;
});
const modellist = computed(() => { //
	let rz =[ ];
	for(let o of config.value){
		rz.push({label:o.modelDescribe,value:o.modelName})
	}

	if(gptConfigStore.myData.userModel){
		let arr = gptConfigStore.myData.userModel.split(/[ ,]+/ig);
		for(let o of arr ){
			rz.push({label:o,value:o})
		}
	}
	//服务端的 CUSTOM_MODELS 设置
	if( homeStore.myData.session.cmodels ){
		let delModel:string[] = [];
		let addModel:string[]=[];
		homeStore.myData.session.cmodels.split(/[ ,]+/ig).map( (v:string)=>{
			if(v.indexOf('-')==0){
				delModel.push(v.substring(1))
			}else{
				addModel.push(v);
			}
		});
		mlog('cmodels',delModel,addModel);
		rz= rz.filter(v=> delModel.indexOf(v.value)==-1 );
		addModel.map(o=>rz.push({label:o,value:o}) )
	}

	let uniqueArray: { label: string, value: string }[] = Array.from(
		new Map(rz.map(item => [JSON.stringify(item), item]))
			.values()
	);
	return uniqueArray ;
});
const ms= useMessage();

const saveChat=(type:string)=>{
	chatSet.save(  nGptStore.value );
	gptConfigStore.setMyData( nGptStore.value );
	homeStore.setMyData({act:'saveChat'});
	if(type!='hide')ms.success( t('common.saveSuccess'));
	emit('close');
}

// 添加一个空选项
const options = ref([]);

const onSelectChange = (newValue: any) => {
	const option = options.value.find(optionValue => optionValue.value === newValue);
	nGptStore.value.kName = option.label;
};

const onSelectChange1 = (newValue: any) => {
	const option = modellist.value.find(optionValue => optionValue.value === newValue);
	nGptStore.value.modelLabel = option.label;
};

watch(()=>nGptStore.value.model,(n)=>{
	nGptStore.value.gpts=undefined;
	let max=4096;
	if( n.indexOf('vision')>-1){
		max=4096;
	}else if( n.indexOf('gpt-4')>-1 ||  n.indexOf('16k')>-1 ){ //['16k','8k','32k','gpt-4'].indexOf(n)>-1
		max=4096*2;
	}else if( n.toLowerCase().includes('claude-3') ){
		max=4096*2;
	}
	config.value.maxToken=max/2;
	if(nGptStore.value.max_tokens> config.value.maxToken ) nGptStore.value.max_tokens= config.value.maxToken;
})

const reSet=()=>{
	gptConfigStore.setInit();
	nGptStore.value= gptConfigStore.myData;
}

</script>
<template>
	<section class="mb-5 justify-between items-center"  >
		<div style="margin-bottom: 8px;"><span class="text-red-500">*</span>  {{ $t('mjset.model') }}</div>
		<n-select class="change-select" v-model:value="nGptStore.model" :options="modellist" @update:value="onSelectChange1" size="small"   />
	</section>

	<section class="mb-5 flex justify-between items-center"  >
		<n-input  class="change-select"  :placeholder="$t('mjchat.modlePlaceholder')" v-model:value="nGptStore.userModel">
			<template #prefix>
				{{ $t('mjchat.myModle') }}
			</template>
		</n-input>
	</section>

	<section class="mb-5 justify-between items-center"  >
		<div  style="margin-bottom: 8px;">{{ $t('mjchat.knowledgeBase') }} </div>
		<n-select class="change-select" v-model:value="nGptStore.kid" :options="options" @update:value="onSelectChange" size="small"   />
	</section>

	<section class=" flex justify-between items-center"  >
		<div style="margin-bottom: 8px;"> {{ $t('mjchat.historyCnt') }}
		</div>
		<div class=" flex justify-end items-center w-[80%] max-w-[240px]">
			<div class=" w-[200px]"><n-slider class="change-slider" v-model:value="nGptStore.talkCount" :step="1" :max="50" /></div>
			<div  class="w-[40px] text-right">{{ nGptStore.talkCount }}</div>
		</div>
	</section>
	<div class="mb-5 text-[12px] text-gray-300 dark:text-gray-300/20">{{ $t('mjchat.historyToken') }}</div>

	<section class=" flex justify-between items-center"  >
		<div> {{ $t('mjchat.historyTCnt') }}
		</div>
		<div class=" flex justify-end items-center w-[80%] max-w-[240px]">
			<div class=" w-[200px]"><n-slider class="change-slider" v-model:value="nGptStore.max_tokens" :step="1" :max="1280000" :min="1" /></div>
			<div  class="w-[100px] text-right">{{ nGptStore.max_tokens }}</div>
		</div>
	</section>
	<div class="mb-5 text-[16px] text-gray-300 dark:text-gray-300/20">{{ $t('mjchat.historyTCntInfo') }}  </div>

	<section class="mb-5 change-select"  >
		<div style="margin-bottom: 8px;">{{ $t('mjchat.role') }}</div>
		<div>
			<n-input  type="textarea"  :placeholder=" $t('mjchat.rolePlaceholder') "   v-model:value="nGptStore.systemMessage" :autosize="{ minRows: 3 }"
			/>
		</div>
	</section>

	<template v-if="st.openMore">
		<section class=" flex justify-between items-center "  >
			<div>{{ $t('mj.temperature') }}</div>
			<div class=" flex justify-end items-center w-[80%] max-w-[240px]">
				<div class=" w-[200px]"><n-slider class="change-slider" v-model:value="nGptStore.temperature" :step="0.01" :max="1" /></div>
				<div  class="w-[40px] text-right">{{ nGptStore.temperature }}</div>
			</div>
		</section>
		<div class="mb-5 text-[12px] text-gray-300 dark:text-gray-300/20"> {{ $t('mj.temperatureInfo') }}</div>


		<section class=" flex justify-between items-center "  >
			<div> {{ $t('mj.top_p') }}</div>
			<div class=" flex justify-end items-center w-[80%] max-w-[240px]">
				<div class=" w-[200px]"><n-slider class="change-slider" v-model:value="nGptStore.top_p" :step="0.01" :max="1" /></div>
				<div  class="w-[40px] text-right">{{ nGptStore.top_p }}</div>
			</div>
		</section>
		<div class="mb-5 text-[12px] text-gray-300 dark:text-gray-300/20">{{ $t('mj.top_pInfo') }}</div>

		<section class=" flex justify-between items-center "  >
			<div> {{ $t('mj.presence_penalty') }}</div>
			<div class=" flex justify-end items-center w-[80%] max-w-[240px]">
				<div class=" w-[200px]"><n-slider class="change-slider" v-model:value="nGptStore.presence_penalty" :step="0.01" :max="1" /></div>
				<div  class="w-[40px] text-right">{{ nGptStore.presence_penalty }}</div>
			</div>
		</section>
		<div class="mb-5 text-[12px] text-gray-300 dark:text-gray-300/20">{{ $t('mj.presence_penaltyInfo') }} </div>


		<section class=" flex justify-between items-center "  >
			<div>{{ $t('mj.frequency_penalty') }}</div>
			<div class=" flex justify-end items-center w-[80%] max-w-[240px]">
				<div class=" w-[200px]"><n-slider class="change-slider" v-model:value="nGptStore.frequency_penalty" :step="0.01" :max="1" /></div>
				<div  class="w-[40px] text-right">{{ nGptStore.frequency_penalty }}</div>
			</div>
		</section>
		<div class="mb-5 text-[12px] text-gray-300 dark:text-gray-300/20">{{ $t('mj.frequency_penaltyInfo') }}</div>

		<section class="mb-4 justify-between items-center change-select"  >
			<div style="margin-bottom: 8px;">{{ $t('mj.tts_voice') }}</div>
			<n-select v-model:value="nGptStore.tts_voice" :options="voiceList" size="small"   />
		</section>


	</template>
	<div v-else class="text-right cursor-pointer mb-4" @click="st.openMore=true">
		<NTag  type="primary" round size="small" :bordered="false" class="!cursor-pointer">More...</NTag>
	</div>

	<section class=" text-right flex justify-end space-x-2 model-button"  >
		<NButton :bordered="false"  @click="reSet()">{{ $t('mj.setBtBack') }}</NButton>
		<!-- <NButton type="primary" @click="saveChat">{{ $t('mj.setBtSaveChat') }}</NButton>
		<NButton type="primary" @click="save">{{ $t('mj.setBtSaveSys') }}</NButton> -->
		<NButton :bordered="false" @click="saveChat('no')">{{ $t('common.save') }}</NButton>
	</section>
</template>
