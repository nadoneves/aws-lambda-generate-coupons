'use strict';

const voucher = require('voucher-code-generator');

module.exports.generator = async event => {

    for (const { messageId, body } of event.Records) {
        
        const { lot_id, qtd} = JSON.parse(body);

        console.log(`[LOTEID: ${lot_id}]> START HANDLER ${qtd}`);
        
        console.log(`> GERANDO CUPONS`);
        
        const list = await generateCoupons(qtd);

        console.log('> CUPONS GERADOS');
        console.log('> GERANDO DATA');

        const data = [];
        for (let i = 0; i < list.length; i++) {
            const c = list[i];
            data.push({
                lot_id,
                coupon: c,
                used: false,
                usedAt: null
            });
        }

        console.log('> DATA GERADO');
        
        console.log('> INICIANDO OS INSERTS');
        
        await store(data);

        console.log('> FINALIZANDO LAMBDA');
        
        return `Successfully processed ${event.Records.length} messages.`; 
        
    }
};

const generateCoupons = qtd => {
    let result = voucher.generate({
        length: 5,
        count: qtd,
        charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    });

    let verificado = result.filter((item, i) => {
        return result.indexOf(item) == i;
    });

    if(result.length ==  verificado.length) {
        return result;
    } else {
        generateCoupons(qtd);
    }
};

const store = async data => {
    const coupons = require('./mongo/coupons');
    await coupons.save(data);
};
