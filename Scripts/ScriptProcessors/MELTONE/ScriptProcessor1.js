/*
	this script is bypassed using the "Bypass" button
	If bypassing it, using the ScriptProcessor bypass function,
	it will lead to hanging notes
	
	If keys are held when switching between the Bypass button 2 states:
	
	if "LetRing" is activated:
	{
		mono => poly : the sounding key will ring and behave just
		like it was pressed in poly mode
		
		(issue with this: if the root note from "mono" mode is pressed, it kills the "ringing" note
		from mono mode)
		
		poly => mono : the last pressed key will ring and
		all other held keys will be silenced
	}
	
	else
	{
		all sounding keys will silenced
	}
		
*/
const Bypass1 = Content.addButton("Bypass1", 0, 10);
const LetRing = Content.addButton("LetRing", 130, 10);
const Time = Content.addKnob("Time", 260, 0);
Content.setPropertiesFromJSON("Time",
{
	"min": 0,
	"max": 1000,
	"stepSize": 1.0,
	"suffix": " ms"
});

reg midiList = Engine.createMidiList();
reg keysdown = [];
keysdown.reserve(10);
reg id = -1;
reg note = 60;

inline function onBypass1Control(component, value)
{
	if (value)	// poly
	{
		if (LetRing.getValue() && keysdown.length)
			midiList.setValue(keysdown[keysdown.length-1], id);
		
		else
			Synth.noteOffByEventId(id);
	}
		
	else  // mono
	{
		if (LetRing.getValue())	// let last played key ring and silence the rest
		{
			note = keysdown[keysdown.length-1];
			id = midiList.getValue(note);
			
			for (k in keysdown)
				if (k != note)
					Synth.noteOffByEventId(midiList.getValue(k));
		}
		
		else	//	silence all held keys
		{
			for (k in keysdown)
				Synth.noteOffByEventId(midiList.getValue(k));
			
			note = -1;
		}
	}
}

Content.getComponent("Bypass1").setControlCallback(onBypass1Control);
function onNoteOn()
{
	//	make artificial notes
	Message.ignoreEvent(true);
	
	local nn = Message.getNoteNumber();
	
	keysdown.push(nn);
	
	if (Bypass1.getValue())	// poly
		midiList.setValue(nn, Synth.addNoteOn(1, nn, Message.getVelocity(), 0));
	/*
		Here's an issue if changing from mono to poly mode
		and "LetRing" is active.
		When pressing the same key as the mono modes "root key" (note)
		it will kill the sounding key if it's still sounding (pitch faded)
	*/

	else // mono
	{
		if (note == -1)
		{
			id = Synth.addNoteOn(1, nn, Message.getVelocity(), 0);
			note = nn;
		}
			
		if (keysdown.length == 1)
		{
			id = Synth.addNoteOn(1, nn, Message.getVelocity(), 0);
			note = nn;
		}
		
		if (keysdown.length > 1)
			Synth.addPitchFade(id, Time.getValue(), nn - note, 0);
	}
}
 function onNoteOff()
{
	local nn = Message.getNoteNumber();
	keysdown.remove(nn);
	
	if (Bypass1.getValue())	// poly
		Synth.noteOffByEventId(midiList.getValue(nn));
	
	else	// mono
	{
		if (!keysdown.length)
			Synth.noteOffByEventId(id);
		
		else
			Synth.addPitchFade(id, Time.getValue(), keysdown[keysdown.length-1] - note, 0);
	}
}
 function onController()
{
	
}
 function onTimer()
{
	
}
 function onControl(number, value)
{
	
}
 