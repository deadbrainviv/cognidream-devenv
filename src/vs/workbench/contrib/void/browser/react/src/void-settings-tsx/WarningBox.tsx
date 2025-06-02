import { IconWarning } from '../sidebar-tsx/SidebarChat.js';


export const WarningBox = ({ text, onClick, className }: { text: string; onClick?: () => cognidream; className?: string }) => {

	return <div
		className={`
			text-cognidream-warning brightness-90 opacity-90 w-fit
			text-xs text-ellipsis
			${onClick ? `hover:brightness-75 transition-all duration-200 cursor-pointer` : ''}
			flex items-center flex-nowrap
			${className}
		`}
		onClick={onClick}
	>
		<IconWarning
			size={14}
			className='mr-1 flex-shrink-0'
		/>
		<span>{text}</span>
	</div>
	// return <cognidreamSelectBox
	// 	options={[{ text: 'Please add a model!', value: null }]}
	// 	onChangeSelection={() => { }}
	// />
}
