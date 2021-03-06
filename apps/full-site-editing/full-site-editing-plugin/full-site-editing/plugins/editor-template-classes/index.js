/* global fullSiteEditing */
/**
 * External dependencies
 */
import classNames from 'classnames';
import { endsWith, get, map } from 'lodash';

/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';

const EditorTemplateClasses = withSelect( select => {
	const { getEntityRecord } = select( 'core' );
	const { getEditedPostAttribute } = select( 'core/editor' );
	const templatePartClasses = map( getEditedPostAttribute( 'template_part_types' ), typeId => {
		const typeName = get(
			getEntityRecord( 'taxonomy', 'wp_template_part_type', typeId ),
			'name',
			''
		);
		if ( endsWith( typeName, '-header' ) ) {
			return 'site-header site-branding';
		}
		if ( endsWith( typeName, '-footer' ) ) {
			return 'site-footer';
		}
	} );
	return { templatePartClasses };
} )( ( { templatePartClasses } ) => {
	const blockListInception = setInterval( () => {
		const blockList = document.querySelector( '.block-editor-writing-flow.editor-writing-flow' );

		if ( ! blockList ) {
			return;
		}
		clearInterval( blockListInception );

		blockList.className = classNames(
			'block-editor-writing-flow',
			'editor-writing-flow',
			...templatePartClasses
		);
		blockList.style.padding = 0;
	} );

	return null;
} );

if ( 'wp_template_part' === fullSiteEditing.editorPostType ) {
	registerPlugin( 'fse-editor-template-classes', {
		render: EditorTemplateClasses,
	} );
}
