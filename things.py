# things.py

# Let's get this party started!
import falcon
import boto3
import datetime
import json
import os
import sys
import csv
import io
import re
import itertools, sys

from datetime import datetime, timedelta

# encoding=utf8
import sys
access_key = "AKIAI2TJNG24CTML6EJA"
secret_key = "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"

total_ec2_cpu_thresh = 0;
cpu_v = 10;  # threshold value
daysTocheck = 3;

region="us-east-1"


dry_run = False;  # True or False, to check permissions
debug_run = False;  # True or False, to enable debug prints

timestamp = '{:%Y-%m-%d-%H:%M:%S}'.format(datetime.utcnow());
ec2_fileout = 'region' + "_ec2_cpu_usage" + ".csv";

now = datetime.utcnow();
start_time = now - timedelta(days=daysTocheck);
end_time = now + timedelta(minutes=5);


def default(o):
    if isinstance(o, (datetime.date, datetime.datetime)):
        return o.isoformat()

# ---------------------------------------------------------------------------------------------------------
# Get Cloudwatch CPU info
# ----------------------------------
def GetCpu(ins):
    global total_ec2_cpu_thresh;
    cpu_arr = [];
    csv_arr = [];
    insid = ins;

    if debug_run: print
    "instance: " + insid + " cpu from", start_time, " to ", end_time, ":-",;

    cpu_avg = cwatchclient.get_metric_statistics(
        Namespace='AWS/EC2',
        MetricName='CPUUtilization',
        Dimensions=[{'Name': 'InstanceId', 'Value': insid}],
        StartTime=start_time,
        EndTime=end_time,
        Period=10800,  # every 3H
        Statistics=['Maximum']);
    # ExtendedStatistics=['p100']);

    if debug_run: print
    cpu_avg;

    if debug_run: print
    "-----------------------"

    # ading instance and time info
    csv_arr.append(insid);
    csv_arr.append(start_time);
    csv_arr.append(end_time);

    if cpu_avg['Datapoints']:
        for datapoints in cpu_avg['Datapoints']:
            cpu_arr.append(datapoints['Maximum']);

        # print cpu_arr;
        # print "-------------------------";
        # print "Size:",    len(cpu_arr);
        # sizec=len(cpu_arr);
        # print "Min:",     min(cpu_arr);
        # minc=min(cpu_arr);
        # print "Max:",     max(cpu_arr);
        # maxc=max(cpu_arr);
        # print "Sum:",     sum(cpu_arr);

        avgc = float(sum(cpu_arr)) / len(cpu_arr) if len(cpu_arr) > 0 else float('nan');
        if avgc < cpu_v:
            total_ec2_cpu_thresh += 1;

        if debug_run: print
        "Min:", min(cpu_arr), " Max:", max(cpu_arr), " Average:", avgc, "lawCPU: ", total_ec2_cpu_thresh;

        csv_arr.append(max(cpu_arr));
        csv_arr.append(min(cpu_arr));
        csv_arr.append(avgc);
        csv_arr.append(len(cpu_arr));
        csv_arr.append(total_ec2_cpu_thresh);


    else:
        if debug_run: print
        "Instance ID: " + insid + " doesn't have datapoints It's seems stopped.";
        csv_arr.append("Instance ID: " + insid + " doesn't have datapoints It's seems stopped.");

    return csv_arr;

def list_instances_by_tag_value(tagkey, tagvalue):
    # When passed a tag key, tag value this will return a list of InstanceIds that were found.

    ec2client = boto3.client('ec2')

    response = ec2client.describe_instances(
        Filters=[
            {
                'Name': 'tag:'+tagkey,
                'Values': [tagvalue]
            }
        ]
    )
    instancelist = []
    for reservation in (response["Reservations"]):
        for instance in reservation["Instances"]:
            instancelist.append(instance["InstanceId"])
    return instancelist

class CORSComponent(object):
    def process_response(self, req, resp, resource, req_succeeded):
        resp.set_header('Access-Control-Allow-Origin', '*')

        if (req_succeeded
            and req.method == 'OPTIONS'
            and req.get_header('Access-Control-Request-Method')
        ):
            # NOTE(kgriffs): This is a CORS preflight request. Patch the
            #   response accordingly.

            allow = resp.get_header('Allow')
            resp.delete_header('Allow')

            allow_headers = req.get_header(
                'Access-Control-Request-Headers',
                default='*'
            )

            resp.set_headers((
                ('Access-Control-Allow-Methods', allow),
                ('Access-Control-Allow-Headers', allow_headers),
                ('Access-Control-Max-Age', '86400'),  # 24 hours
            ))


# Falcon follows the REST architectural style, meaning (among
# other things) that you think in terms of resources and state
# transitions, which map to HTTP verbs.
class InstancesResource(object):
    def on_get(self, req, resp):
        """Handles Instances GET requests"""
        print 'Get /instances'
        print 'Get params: '
        print req.params



        ec2 = boto3.client('ec2')

        # Retrieves all regions/endpoints that work with EC2
        #response = ec2.describe_regions()
        #print('Regions:', response['Regions'])

        # Retrieves availability zones only for region of the ec2 object
        #response = ec2.describe_availability_zones()
        #print('Availability Zones:', response['AvailabilityZones'])
        resp.status = falcon.HTTP_200  # This is the default status
        #resp.body = ('\nTwo things awe me most, the starry sky '
        #             'above me and the moral law within me.\n'
        #             '\n'
        #             '    ~ Immanuel Kant\n\n')
        instanceObjArray = []
        instanceObj = { "id": ""}

        client = boto3.client('ec2')
        #client = boto3.client('ec2', aws_access_key_id=access_key, aws_secret_access_key=secret_key,
        #                          region_name='us-east-1')
        custome_filter = [{
            'Name':'tag:business unit',
            'Values': ['Multimedia and Platforms Group(MPG)']}]
        #response = client.describe_instances(Filters=custome_filter)
        #ec2_regions = [region['RegionName'] for region in client.describe_regions()['Regions']]
        instanceObj = {}
        if 'instanceid' in req.params and 'region' in req.params:
            print 'Received instanceid'
            ec2 = boto3.resource('ec2',region_name=req.params['region'])
            ec2instance = ec2.Instance(req.params['instanceid'])
            if ec2instance:
                instanceObj = {}
                #print instance
                #print (instance.id, instance.instance_type, region, instance.launch_time)
                instanceObj["id"] = ec2instance.id
                instanceObj["instance_type"] = ec2instance.instance_type
                instanceObj["region"] = req.params['region']
                instanceObj["image_id"] = ec2instance.image_id
                #instanceObj["public_ip"] = ec2instance.placement.
                instanceObj["tag_list"] = '['
                for tag in ec2instance.tags:
                    instanceObj[tag["Key"]] = tag["Value"]
                    instanceObj["tag_list"] += '{' + tag["Key"] + ',' + tag["Value"] + '}'
                instanceObj["tag_list"] += ']'
                #Get CPU Utilisation
                global total_ec2_cpu_thresh;
                cpu_arr = [];
                csv_arr = [];
                cwatchclient = boto3.client('cloudwatch', region_name=req.params['region']);
                cpu_avg = cwatchclient.get_metric_statistics(
                    Namespace='AWS/EC2',
                    MetricName='CPUUtilization',
                    Dimensions=[{'Name': 'InstanceId', 'Value': ec2instance.id}],
                    StartTime=start_time,
                    EndTime=end_time,
                    Period=10800,  # every 3H
                    Statistics=['Maximum']);
                print cpu_avg
                if cpu_avg['Datapoints']:
                    for datapoints in cpu_avg['Datapoints']:
                        cpu_arr.append(datapoints['Maximum']);


                    avgc = float(sum(cpu_arr)) / len(cpu_arr) if len(cpu_arr) > 0 else float('nan');
                    if avgc < cpu_v:
                        total_ec2_cpu_thresh += 1;

                    print "Min:", min(cpu_arr), " Max:", max(cpu_arr), " Average:", avgc, "lawCPU: ", total_ec2_cpu_thresh;
                    instanceObj["min_cpu_util"] = min(cpu_arr)
                    instanceObj["max_cpu_util"] = max(cpu_arr)
                    instanceObj["avg_cpu_util"] = avgc
                    #csv_arr.append(max(cpu_arr));
                    #csv_arr.append(min(cpu_arr));
                    #csv_arr.append(avgc);
                    #csv_arr.append(len(cpu_arr));
                    #csv_arr.append(total_ec2_cpu_thresh);
                else:
                    print "Instance ID: " + ec2instance.id + " doesn't have datapoints It's seems stopped.";
                print instanceObj
                #instanceObjArray.append(instanceObj)
            resp.body = json.dumps(instanceObj, sort_keys = True, indent = 1, default = default)

        elif 'business_unit' in req.params and req.params['business_unit'] != 'null':
            ec2_regions = ['us-east-1','us-east-2']
            for region in ec2_regions:
                conn = boto3.resource('ec2', aws_access_key_id=access_key, aws_secret_access_key=secret_key,region_name=region)
                custome_filter = [{
                    'Name':'tag:business_unit',
                    'Values': [req.params['business_unit']]}]
                instances = conn.instances.filter(Filters=custome_filter)
                for instance in instances:
                    if instance.state["Name"] == "running":
                        instanceObj = {}
                        #print instance
                        #print (instance.id, instance.instance_type, region, instance.launch_time)
                        instanceObj["id"] = instance.id
                        instanceObj["instance_type"] = instance.instance_type
                        instanceObj["region"] = region

                        for tag in instance.tags:
                            instanceObj[tag["Key"]] = tag["Value"]
                            #print instanceObj
                        instanceObjArray.append(instanceObj)
                        #resObj = response["Reservations"]
                        #print resObj
            resp.body = json.dumps(instanceObjArray, sort_keys = True, indent = 1, default = default)
        else :
            ec2_regions = ['us-east-1','us-east-2']
            for region in ec2_regions:
                conn = boto3.resource('ec2', aws_access_key_id=access_key, aws_secret_access_key=secret_key,region_name=region)
                instances = conn.instances.filter()
                for instance in instances:
                    if instance.state["Name"] == "running":
                        instanceObj = {}
                        #print instance
                        #print (instance.id, instance.instance_type, region, instance.launch_time)
                        instanceObj["id"] = instance.id
                        instanceObj["instance_type"] = instance.instance_type
                        instanceObj["region"] = region

                        for tag in instance.tags:
                            instanceObj[tag["Key"]] = tag["Value"]
                            #print instanceObj
                        instanceObjArray.append(instanceObj)
                        #resObj = response["Reservations"]
                        #print resObj
            resp.body = json.dumps(instanceObjArray, sort_keys = True, indent = 1, default = default)
    def on_post(self, req, resp):
        """Handles Instances POST requests"""
        print 'POST'
        # Boto 3 InstanceType="c3.xlarge"
        #ec2 = boto3.resource('ec2')

        #instance = ec2.create_instances(
        #    ImageId='ami-5eb63a32',
        #    MinCount=1,
        #    MaxCount=1,
        #    InstanceType='t2.micro',
        #    )
        #print(instance[0].id)
        #ec2.create_instances(ImageId='<ami-image-id>', MinCount=1, MaxCount=5)


        ec2 = boto3.client('ec2')

        # Retrieves all regions/endpoints that work with EC2
        #response = ec2.describe_regions()
        #print('Regions:', response['Regions'])

        # Retrieves availability zones only for region of the ec2 object
        #response = ec2.describe_availability_zones()
        #print('Availability Zones:', response['AvailabilityZones'])
        resp.status = falcon.HTTP_200  # This is the default status
        #resp.body = ('\nTwo things awe me most, the starry sky '
        #             'above me and the moral law within me.\n'
        #             '\n'
        #             '    ~ Immanuel Kant\n\n')
        instanceObjArray = []
        instanceObj = { "id": ""}

        client = boto3.client('ec2')
        #client = boto3.client('ec2', aws_access_key_id=access_key, aws_secret_access_key=secret_key,
        #                          region_name='us-east-1')
        custome_filter = [{
            'Name':'tag:business unit',
            'Values': ['Multimedia and Platforms Group(MPG)']}]
        #response = client.describe_instances(Filters=custome_filter)
        #ec2_regions = [region['RegionName'] for region in client.describe_regions()['Regions']]
        instanceObj = {}
        if 'instanceid' in req.params and 'region' in req.params:
            print 'Received instanceid'
            ec2 = boto3.resource('ec2',region_name=req.params['region'])
            ec2instance = ec2.Instance(req.params['instanceid'])
            if ec2instance:
                instanceObj = {}
                #print instance
                #print (instance.id, instance.instance_type, region, instance.launch_time)
                instanceObj["id"] = ec2instance.id
                instanceObj["instance_type"] = ec2instance.instance_type
                instanceObj["region"] = req.params['region']
                instanceObj["image_id"] = ec2instance.image_id
                #instanceObj["public_ip"] = ec2instance.placement.
                ec2.create_tags(Resources=[ec2instance.id], Tags=[{'Key': req.params['key'], 'Value':req.params['value']}])
                instanceObj["tag_list"] = '['
                for tag in ec2instance.tags:
                    instanceObj[tag["Key"]] = tag["Value"]
                    instanceObj["tag_list"] += '{' + tag["Key"] + ',' + tag["Value"] + '}'
                instanceObj["tag_list"] += ']'
                #Get CPU Utilisation
                global total_ec2_cpu_thresh;
                cpu_arr = [];
                csv_arr = [];
                cwatchclient = boto3.client('cloudwatch', region_name=req.params['region']);
                cpu_avg = cwatchclient.get_metric_statistics(
                    Namespace='AWS/EC2',
                    MetricName='CPUUtilization',
                    Dimensions=[{'Name': 'InstanceId', 'Value': ec2instance.id}],
                    StartTime=start_time,
                    EndTime=end_time,
                    Period=10800,  # every 3H
                    Statistics=['Maximum']);
                print cpu_avg
                if cpu_avg['Datapoints']:
                    for datapoints in cpu_avg['Datapoints']:
                        cpu_arr.append(datapoints['Maximum']);


                    avgc = float(sum(cpu_arr)) / len(cpu_arr) if len(cpu_arr) > 0 else float('nan');
                    if avgc < cpu_v:
                        total_ec2_cpu_thresh += 1;

                    print "Min:", min(cpu_arr), " Max:", max(cpu_arr), " Average:", avgc, "lawCPU: ", total_ec2_cpu_thresh;
                    instanceObj["min_cpu_util"] = min(cpu_arr)
                    instanceObj["max_cpu_util"] = max(cpu_arr)
                    instanceObj["avg_cpu_util"] = avgc
                    #csv_arr.append(max(cpu_arr));
                    #csv_arr.append(min(cpu_arr));
                    #csv_arr.append(avgc);
                    #csv_arr.append(len(cpu_arr));
                    #csv_arr.append(total_ec2_cpu_thresh);
                else:
                    print "Instance ID: " + ec2instance.id + " doesn't have datapoints It's seems stopped.";
                print instanceObj
                #instanceObjArray.append(instanceObj)
        resp.body = json.dumps(instanceObj, sort_keys = True, indent = 1, default = default)


    def on_delete(self, req, resp):
        import boto3
        ids = ['i-0bec2a0bf000bb71c']
        ec2 = boto3.resource('ec2')
        ec2.instances.filter(InstanceIds = ids).stop() #for stopping an ec2 instance

        ec2.instances.filter(InstanceIds = ids).terminate() #for terminating an ec2 instance
    def on_put(self, req, resp):
        """Handles Instances POST requests"""
        print 'POST'

# falcon.API instances are callable WSGI apps
app = falcon.API(middleware=[CORSComponent() ])

# Resources are represented by long-lived class instances
instances = InstancesResource()

# things will handle all requests to the '/things' URL path
app.add_route('/instances', instances)
#app.add_route('/instances/{instanceid}', instances)
