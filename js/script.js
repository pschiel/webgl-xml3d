$(function() {
	"use strict";

	var vertex_source;
	var fragment_source;

	$.ajax({
		url: 'shader/testshader.vs',
		async: false,
		success: function(data) {
			vertex_source = data;
		}
	});

	$.ajax({
		url: 'shader/testshader.fs',
		async: false,
		success: function(data) {
			fragment_source = data;
		}
	});

	XML3D.shaders.register("testshader", {
		vertex: vertex_source,
		fragment: fragment_source,
		uniforms: {
			lod: 2,
			baseunit: 1.0
		}
	});
	
	XML3D.webgl.GLMesh.prototype.setBuffer = function (name, buffer) {
		
		this.buffers[name] = buffer;
		this.isIndexed = this.isIndexed || name === "index";
		
		// ...
		var elemCount = this.getElementCount();
		this.popLevels = [elemCount];
		
	};
	
	XML3D.webgl.GLMesh.prototype.getPopElementCount = function() {
		var elemCount = this.popLevels[0];
		return elemCount;
	};

	XML3D.webgl.GLMesh.prototype.draw = function(program) {

		var gl = this.context.gl,
				sAttributes = program.attributes,
				buffers = this.buffers,
				triCount = 0;

		//Bind vertex buffers
		for (var name in sAttributes) {
			var shaderAttribute = sAttributes[name];
			var buffer = buffers[name];
			if (!buffer) {
				continue;
			}
			gl.enableVertexAttribArray(shaderAttribute.location);
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.vertexAttribPointer(shaderAttribute.location, buffer.tupleSize, buffer.glType, false, 0, 0);
		}

		//Draw the object
		if (this.isIndexed) {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);
			var elemCount = this.getElementCount();
			if (this.segments) {
				//This is a segmented mesh (eg. a collection of disjunct line strips)
				var offset = 0;
				var sd = this.segments.value;
				for (var j = 0; j < sd.length; j++) {
					gl.drawElements(this.glType, sd[j], gl.UNSIGNED_SHORT, offset);
					offset += sd[j] * 2; //GL size for UNSIGNED_SHORT is 2 bytes
				}
			} else {
				elemCount = this.getPopElementCount();
				console.log("indexed: " + elemCount);
				gl.drawElements(this.glType, elemCount, gl.UNSIGNED_SHORT, 0);
			}
			triCount = elemCount / 3;
		} else {
			triCount = this.getVertexCount();
			if (this.size) {
				var offset = 0;
				var sd = this.size.data;
				for (var j = 0; j < sd.length; j++) {
					gl.drawArrays(this.glType, offset, sd[j]);
					offset += sd[j] * 2; //GL size for UNSIGNED_SHORT is 2 bytes
				}
			} else {
				// console.log("drawArrays: " + mesh.getVertexCount());
				gl.drawArrays(this.glType, 0, triCount);
			}
		}

		//Unbind vertex buffers
		for (var name in sAttributes) {
			var shaderAttribute = sAttributes[name];
			gl.disableVertexAttribArray(shaderAttribute.location);
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		if (program.undoUniformVariableOverride)
			program.undoUniformVariableOverride(this.uniformOverride);

		return triCount;
	};

	$('#lod,#baseunit').change(function() {
		var lod = $('#lod').val();
		var baseunit = $('#baseunit').val();
		$('#testshader float[name=lod]').text(lod);
		$('#testshader float[name=baseunit]').text(baseunit);
	});

});