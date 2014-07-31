Xflow.registerOperator("xflow.popsort", {

    outputs: [
		{type: 'int', name: 'resultIndex', customAlloc: true},
		{type: 'float3', name: 'resultPosition', customAlloc: true}
	],
    params:  [
		{type: 'int', source: 'index'},
		{type: 'float3', source: 'position'}
	],

	alloc: function(sizes, index, position) {
		sizes['resultIndex'] = index.length;
		sizes['resultPosition'] = position.length;
	},

    evaluate: function(resultIndex, resultPosition, index, position) {

		var i;
		console.log('popsort evaluate');

		for (i = 0; i < index.length; i++) {
			resultIndex[i] = index[i];
		}

		for (i = 0; i < position.length; i++) {
			resultPosition[i] = position[i] / 2.0;
		}

	}

});
